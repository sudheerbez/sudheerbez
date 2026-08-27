/**
 * Meta OAuth redirect callback (Netlify Function).
 * Path: /api/meta/oauth/callback
 *
 * Env: META_APP_ID, META_APP_SECRET, META_OAUTH_SUCCESS_URL (optional forward)
 */
const https = require("https");

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
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 36rem; margin: 3rem auto; padding: 0 1.25rem; color: #111; line-height: 1.5; }
    code { background: #f2f2f2; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; }
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
    req.on("error", reject);
    req.end();
  });
}

exports.handler = async (event) => {
  const method = event.httpMethod || "GET";
  if (method !== "GET" && method !== "HEAD") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const q = event.queryStringParameters || {};

  if (!q.code && !q.error && !q.state) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: htmlPage(
        "Meta OAuth callback",
        `<h1 class="ok">Valid OAuth redirect URI</h1>
         <p>This endpoint is ready for Meta OAuth / Embedded Signup.</p>
         <p>Use: <code>${oauthCallbackUrl()}</code></p>`
      ),
    };
  }

  if (q.error) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: htmlPage(
        "Meta OAuth error",
        `<h1 class="err">Authorization failed</h1>
         <p><code>${String(q.error)}</code></p>
         <p>${String(q.error_description || "")}</p>`
      ),
    };
  }

  let tokenResult = null;
  try {
    tokenResult = await exchangeCodeForToken(q.code);
  } catch (err) {
    console.error("meta_oauth_exchange_failed", err);
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
    const dest = new URL(successUrl);
    if (q.state) dest.searchParams.set("state", q.state);
    if (tokenResult?.access_token) {
      dest.searchParams.set("connected", "1");
    } else if (q.code) {
      dest.searchParams.set("code", q.code);
    }
    return {
      statusCode: 302,
      headers: { Location: dest.toString() },
      body: "",
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: htmlPage(
      "Connected",
      `<h1 class="ok">Meta authorization received</h1>
       <p>You can close this window and return to your app.</p>
       ${q.state ? `<p>State: <code>${String(q.state)}</code></p>` : ""}`
    ),
  };
};
