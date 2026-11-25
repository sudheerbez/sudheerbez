/**
 * Meta WhatsApp Cloud API webhook (Vercel)
 * URL after Vercel deploy: https://<project>.vercel.app/api/whatsapp/webhook
 *
 * Env (both REQUIRED): WHATSAPP_VERIFY_TOKEN, WHATSAPP_APP_SECRET
 * Fails closed without the app secret; logs mask phone numbers and omit message text.
 */
import crypto from "node:crypto";

const MAX_BODY_BYTES = 1024 * 1024;

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function sendText(res, status, body) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).send(body);
}

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("payload_too_large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function verifyMetaSignature(rawBody, signatureHeader, appSecret) {
  if (!appSecret) return false;
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) return false;
  const expected = crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
  return timingSafeEqual(signatureHeader.slice("sha256=".length), expected);
}

function maskPhone(value) {
  const s = String(value ?? "");
  return s.length > 4 ? `***${s.slice(-4)}` : "***";
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = first(req.query["hub.mode"]);
    const token = first(req.query["hub.verify_token"]);
    const challenge = first(req.query["hub.challenge"]);
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (!verifyToken) {
      sendText(res, 500, "WHATSAPP_VERIFY_TOKEN is not configured");
      return;
    }
    if (mode === "subscribe" && token && timingSafeEqual(token, verifyToken)) {
      sendText(res, 200, String(challenge ?? "").slice(0, 200));
      return;
    }
    sendText(res, 403, "Forbidden");
    return;
  }

  if (req.method === "POST") {
    const appSecret = process.env.WHATSAPP_APP_SECRET;
    if (!appSecret) {
      console.error("whatsapp_webhook_misconfigured: WHATSAPP_APP_SECRET is not set");
      sendText(res, 500, "WHATSAPP_APP_SECRET is not configured");
      return;
    }

    let rawBody;
    try {
      rawBody = await readRawBody(req);
    } catch {
      sendText(res, 413, "Payload Too Large");
      return;
    }

    const signature = req.headers["x-hub-signature-256"];
    if (!verifyMetaSignature(rawBody, signature, appSecret)) {
      sendText(res, 401, "Invalid signature");
      return;
    }

    let payload = {};
    try {
      payload = JSON.parse(rawBody.toString("utf8") || "{}");
    } catch {
      sendText(res, 400, "Invalid JSON");
      return;
    }

    const inbound = [];
    for (const entry of payload.entry || []) {
      for (const change of entry?.changes || []) {
        const messages = change?.value?.messages;
        if (!Array.isArray(messages)) continue;
        for (const msg of messages) {
          inbound.push({
            from: maskPhone(msg?.from),
            id: msg?.id,
            type: msg?.type,
            textLength: typeof msg?.text?.body === "string" ? msg.text.body.length : 0,
          });
        }
      }
    }
    if (inbound.length) {
      console.log("whatsapp_inbound", JSON.stringify(inbound));
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ ok: true, received: inbound.length });
    return;
  }

  sendText(res, 405, "Method Not Allowed");
}

// Read the raw body ourselves (needed for the HMAC signature check).
export const config = {
  api: {
    bodyParser: false,
  },
};
