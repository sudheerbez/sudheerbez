/**
 * Meta WhatsApp Cloud API webhook callback.
 * Callback URL (after Netlify deploy):
 *   https://<your-site>.netlify.app/api/whatsapp/webhook
 *
 * Env (set in Netlify → Site settings → Environment variables):
 *   WHATSAPP_VERIFY_TOKEN  — same string you enter in Meta Developer Console
 *   WHATSAPP_APP_SECRET    — optional; App Secret for X-Hub-Signature-256 checks
 */
const crypto = require("crypto");

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyMetaSignature(rawBody, signatureHeader, appSecret) {
  if (!appSecret) return true;
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");
  return timingSafeEqual(signatureHeader.slice("sha256=".length), expected);
}

function handleVerification(query) {
  const mode = query["hub.mode"];
  const token = query["hub.verify_token"];
  const challenge = query["hub.challenge"];
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (!verifyToken) {
    return {
      statusCode: 500,
      body: "WHATSAPP_VERIFY_TOKEN is not configured",
    };
  }

  if (mode === "subscribe" && token && timingSafeEqual(token, verifyToken)) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: challenge ?? "",
    };
  }

  return { statusCode: 403, body: "Forbidden" };
}

function extractInboundMessages(payload) {
  const messages = [];
  const entries = payload?.entry ?? [];
  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      if (!value?.messages) continue;
      for (const msg of value.messages) {
        messages.push({
          wabaId: entry.id,
          phoneNumberId: value.metadata?.phone_number_id,
          from: msg.from,
          id: msg.id,
          timestamp: msg.timestamp,
          type: msg.type,
          text: msg.text?.body ?? null,
          raw: msg,
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
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64").toString("utf8")
      : event.body || "";

    const appSecret = process.env.WHATSAPP_APP_SECRET;
    const signature =
      event.headers?.["x-hub-signature-256"] ||
      event.headers?.["X-Hub-Signature-256"];

    if (!verifyMetaSignature(rawBody, signature, appSecret)) {
      return { statusCode: 401, body: "Invalid signature" };
    }

    let payload;
    try {
      payload = JSON.parse(rawBody || "{}");
    } catch {
      return { statusCode: 400, body: "Invalid JSON" };
    }

    const inbound = extractInboundMessages(payload);
    if (inbound.length) {
      console.log(
        "whatsapp_inbound",
        JSON.stringify(
          inbound.map(({ id, from, type, text, phoneNumberId }) => ({
            id,
            from,
            type,
            text,
            phoneNumberId,
          }))
        )
      );
    }

    // Acknowledge immediately — Meta retries on non-2xx / timeouts.
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, received: inbound.length }),
    };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
