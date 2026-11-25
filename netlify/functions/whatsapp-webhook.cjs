/**
 * Meta WhatsApp Cloud API webhook (Netlify Function).
 * Callback path: /api/whatsapp/webhook
 *
 * Env (both REQUIRED):
 *   WHATSAPP_VERIFY_TOKEN  – the string you type into Meta's webhook setup
 *   WHATSAPP_APP_SECRET    – Meta App Secret; every POST must carry a valid
 *                            X-Hub-Signature-256 or it is rejected.
 *
 * Security notes:
 *  - Fails closed: if the app secret is missing, POSTs are refused (no unsigned events).
 *  - Logs mask phone numbers and never store message text.
 */
const crypto = require("crypto");

const MAX_BODY_BYTES = 1024 * 1024; // 1 MB — Meta payloads are far smaller

const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
};

function text(statusCode, body) {
  return { statusCode, headers: TEXT_HEADERS, body };
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyMetaSignature(rawBody, signatureHeader, appSecret) {
  if (!appSecret) return false;
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");
  return timingSafeEqual(signatureHeader.slice("sha256=".length), expected);
}

function maskPhone(value) {
  const s = String(value ?? "");
  return s.length > 4 ? `***${s.slice(-4)}` : "***";
}

function handleVerification(query) {
  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    return text(500, "WHATSAPP_VERIFY_TOKEN is not configured");
  }

  if (mode === "subscribe" && token && timingSafeEqual(token, verifyToken)) {
    return text(200, String(challenge ?? "").slice(0, 200));
  }

  return text(403, "Forbidden");
}

function extractInboundMessages(payload) {
  const messages = [];
  for (const entry of payload?.entry ?? []) {
    for (const change of entry?.changes ?? []) {
      const value = change?.value;
      if (!Array.isArray(value?.messages)) continue;
      for (const msg of value.messages) {
        messages.push({
          wabaId: entry.id,
          phoneNumberId: value.metadata?.phone_number_id,
          from: maskPhone(msg?.from),
          id: msg?.id,
          timestamp: msg?.timestamp,
          type: msg?.type,
          textLength: typeof msg?.text?.body === "string" ? msg.text.body.length : 0,
        });
      }
    }
  }
  return messages;
}

exports.handler = async (event) => {
  const method = event.httpMethod || event.requestContext?.http?.method;

  if (method === "GET") {
    return handleVerification(event.queryStringParameters || {});
  }

  if (method === "POST") {
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) {
      console.error("whatsapp_webhook_misconfigured: WHATSAPP_APP_SECRET is not set");
      return text(500, "WHATSAPP_APP_SECRET is not configured");
    }

    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "", "utf8");

    if (rawBody.length > MAX_BODY_BYTES) {
      return text(413, "Payload Too Large");
    }

    const headers = event.headers || {};
    const signature = headers["x-hub-signature-256"] || headers["X-Hub-Signature-256"];

    if (!verifyMetaSignature(rawBody, signature, appSecret)) {
      return text(401, "Invalid signature");
    }

    let payload;
    try {
      payload = JSON.parse(rawBody.toString("utf8") || "{}");
    } catch {
      return text(400, "Invalid JSON");
    }

    const inbound = extractInboundMessages(payload);
    if (inbound.length) {
      console.log("whatsapp_inbound", JSON.stringify(inbound));
    }

    return {
      statusCode: 200,
      headers: { ...TEXT_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, received: inbound.length }),
    };
  }

  return text(405, "Method Not Allowed");
};
