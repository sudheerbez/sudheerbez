/**
 * Meta WhatsApp Cloud API webhook
 * URL after Vercel deploy: https://<project>.vercel.app/api/whatsapp/webhook
 */
const crypto = require("crypto");

function timingSafeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
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

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (!verifyToken) {
      res.status(500).send("WHATSAPP_VERIFY_TOKEN is not configured");
      return;
    }
    if (mode === "subscribe" && token && timingSafeEqual(token, verifyToken)) {
      res.status(200).send(challenge ?? "");
      return;
    }
    res.status(403).send("Forbidden");
    return;
  }

  if (req.method === "POST") {
    const rawBody = await readRawBody(req);
    const signature = req.headers["x-hub-signature-256"];
    if (!verifyMetaSignature(rawBody, signature, process.env.WHATSAPP_APP_SECRET)) {
      res.status(401).send("Invalid signature");
      return;
    }

    let payload = {};
    try {
      payload = JSON.parse(rawBody || "{}");
    } catch {
      res.status(400).send("Invalid JSON");
      return;
    }

    const inbound = [];
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        for (const msg of change.value?.messages || []) {
          inbound.push({
            from: msg.from,
            id: msg.id,
            type: msg.type,
            text: msg.text?.body || null,
          });
        }
      }
    }
    if (inbound.length) {
      console.log("whatsapp_inbound", JSON.stringify(inbound));
    }
    res.status(200).json({ ok: true, received: inbound.length });
    return;
  }

  res.status(405).send("Method Not Allowed");
};
