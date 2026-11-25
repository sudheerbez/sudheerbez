/**
 * Meta OAuth redirect URI (Vercel)
 * Add in Meta → Facebook Login → Valid OAuth Redirect URIs:
 *   https://<project>.vercel.app/api/meta/oauth/callback
 *
 * Security: query values are never echoed unescaped (prevents reflected XSS);
 * responses are no-store / no-referrer / not frameable.
 */
const HTML_CSP =
  "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function setCommonHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
}

function sendHtml(res, status, body) {
  setCommonHeaders(res);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Security-Policy", HTML_CSP);
  res.status(status).send(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"></head><body style="font-family:system-ui;padding:2rem">${body}</body></html>`
  );
}

function sendText(res, status, body) {
  setCommonHeaders(res);
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(status).send(body);
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendText(res, 405, "Method Not Allowed");
    return;
  }

  const q = req.query || {};
  const code = first(q.code);
  const error = first(q.error);
  const state = first(q.state);

  if (!code && !error && !state) {
    sendHtml(res, 200, "<h1>Valid OAuth redirect URI</h1><p>Meta OAuth callback is ready.</p>");
    return;
  }

  if (error) {
    // Plain text: the error value is attacker-controllable and must never be rendered as HTML.
    sendText(res, 400, `OAuth error: ${String(error).slice(0, 300)}`);
    return;
  }

  console.log("meta_oauth_code_received", JSON.stringify({ state: state || null }));

  const successUrl = process.env.META_OAUTH_SUCCESS_URL;
  if (successUrl) {
    let dest = null;
    try {
      dest = new URL(successUrl);
    } catch {
      console.error("meta_oauth_bad_success_url");
    }
    if (dest && dest.protocol === "https:") {
      if (state) dest.searchParams.set("state", String(state));
      if (code) dest.searchParams.set("code", String(code));
      setCommonHeaders(res);
      res.redirect(302, dest.toString());
      return;
    }
  }

  sendHtml(res, 200, "<h1>Meta authorization received</h1><p>You can close this window.</p>");
}
