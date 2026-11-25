/**
 * Meta OAuth redirect callback (Netlify Function).
 * Path: /api/meta/oauth/callback
 *
 * Env: META_APP_ID, META_APP_SECRET, META_OAUTH_SUCCESS_URL (optional forward)
 *
 * Security notes:
 *  - Every query-string value echoed into HTML is escaped (prevents reflected XSS).
 *  - Responses carry a locked-down CSP, no-referrer (the URL contains the OAuth
 *    code), no-store, and anti-framing headers.
 */
const https = require("https");

const HTML_HEADERS = {
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
};

const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
};

function escapeHtml(value) {
  return String(value ?? "")
    .slice(0, 300)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function siteOrigin() {
  const base = process.env.URL || process.env.DEPLOY_PRIME_URL || "";
  return String(base).replace(/\/$/, "");
}

function oauthCallbackUrl() {
  return `${siteOrigin()}/api/meta/oauth/callback`;
}

function htmlPage(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 36rem; margin: 3rem auto; padding: 0 1.25rem; color: #111; line-height: 1.5; }
    code { background: #f2f2f2; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; word-break: break-all; }
    .ok { color: #0a7a32; }
    .err { color: #b42318; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function exchangeCodeForToken(code) {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) return Promise.resolve(null);

  const redirectUri = oauthCallbackUrl();
  const path =
    `/oauth/access_token?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&client_secret=${encodeURIComponent(appSecret)}` +
    `&code=${encodeURIComponent(code)}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "graph.facebook.com",
        path: `/v21.0${path}`,
        method: "GET",
        timeout: 8000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      }
    );
    req.on("timeout", () => req.destroy(new Error("graph_api_timeout")));
    req.on("error", reject);
    req.end();
  });
}

function successRedirect(successUrl, q, tokenResult) {
  let dest;
  try {
    dest = new URL(successUrl);
  } catch {
    console.error("meta_oauth_bad_success_url");
    return null;
  }
  if (dest.protocol !== "https:") return null;
  if (q.state) dest.searchParams.set("state", String(q.state));
  if (tokenResult?.access_token) {
    dest.searchParams.set("connected", "1");
  } else if (q.code) {
    dest.searchParams.set("code", String(q.code));
  }
  return {
    statusCode: 302,
    headers: {
      Location: dest.toString(),
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "no-store",
    },
    body: "",
  };
}

exports.handler = async (event) => {
  const method = event.httpMethod || "GET";
  if (method !== "GET" && method !== "HEAD") {
    return { statusCode: 405, headers: TEXT_HEADERS, body: "Method Not Allowed" };
  }

  const q = event.queryStringParameters || {};

  if (!q.code && !q.error && !q.state) {
    return {
      statusCode: 200,
      headers: HTML_HEADERS,
      body: htmlPage(
        "Meta OAuth callback",
        `<h1 class="ok">Valid OAuth redirect URI</h1>
         <p>This endpoint is ready for Meta OAuth / Embedded Signup.</p>
         <p>Use: <code>${escapeHtml(oauthCallbackUrl())}</code></p>`
      ),
    };
  }

  if (q.error) {
    return {
      statusCode: 400,
      headers: HTML_HEADERS,
      body: htmlPage(
        "Meta OAuth error",
        `<h1 class="err">Authorization failed</h1>
         <p><code>${escapeHtml(q.error)}</code></p>
         <p>${escapeHtml(q.error_description)}</p>`
      ),
    };
  }

  let tokenResult = null;
  if (q.code) {
    try {
      tokenResult = await exchangeCodeForToken(String(q.code));
    } catch (err) {
      console.error("meta_oauth_exchange_failed", err?.message || err);
    }
  }

  if (tokenResult?.access_token) {
    console.log(
      "meta_oauth_success",
      JSON.stringify({
        state: q.state || null,
        token_type: tokenResult.token_type || null,
        expires_in: tokenResult.expires_in || null,
      })
    );
  } else if (q.code) {
    console.log(
      "meta_oauth_code_received",
      JSON.stringify({ state: q.state || null, exchanged: false })
    );
  }

  const successUrl = process.env.META_OAUTH_SUCCESS_URL;
  if (successUrl) {
    const redirect = successRedirect(successUrl, q, tokenResult);
    if (redirect) return redirect;
  }

  return {
    statusCode: 200,
    headers: HTML_HEADERS,
    body: htmlPage(
      "Connected",
      `<h1 class="ok">Meta authorization received</h1>
       <p>You can close this window and return to your app.</p>
       ${q.state ? `<p>State: <code>${escapeHtml(q.state)}</code></p>` : ""}`
    ),
  };
};
