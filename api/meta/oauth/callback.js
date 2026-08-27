/**
 * Meta OAuth redirect URI
 * Add in Meta → Facebook Login → Valid OAuth Redirect URIs:
 *   https://<project>.vercel.app/api/meta/oauth/callback
 */
module.exports = async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const q = req.query || {};

  if (!q.code && !q.error && !q.state) {
    res.status(200).setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(
      "<!DOCTYPE html><html><body style='font-family:system-ui;padding:2rem'><h1>Valid OAuth redirect URI</h1><p>Meta OAuth callback is ready.</p></body></html>"
    );
    return;
  }

  if (q.error) {
    res.status(400).send(`OAuth error: ${q.error}`);
    return;
  }

  console.log(
    "meta_oauth_code_received",
    JSON.stringify({ state: q.state || null })
  );

  const successUrl = process.env.META_OAUTH_SUCCESS_URL;
  if (successUrl) {
    const dest = new URL(successUrl);
    if (q.state) dest.searchParams.set("state", q.state);
    if (q.code) dest.searchParams.set("code", q.code);
    res.redirect(302, dest.toString());
    return;
  }

  res.status(200).setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(
    "<!DOCTYPE html><html><body style='font-family:system-ui;padding:2rem'><h1>Meta authorization received</h1><p>You can close this window.</p></body></html>"
  );
};
