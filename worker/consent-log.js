// Cookie-consent audit trail. Reusable across sites: copy this file next to the
// site's Worker, set the SITE var, bind CONSENT_DB (see schema.sql) and route
// /api/consent* to handleConsent().
//
// Every cookie choice (accept, reject, change, withdraw) is stored in the D1
// table consent_log with the site name, a random consent ID, the choice, the
// policy version and the page path. No IP address or user agent is stored, and
// the time is set here on the server.
//
// Settings (wrangler.jsonc, and again under "previews" for staging):
//   vars.SITE            the site's domain, e.g. "pixel-north.co.uk" (required)
//   CONSENT_DB           the D1 database binding (required)
//   CONSENT_ADMIN_TOKEN  secret for the lookup endpoint (optional)

const ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const ACTIONS = new Set(["accept", "reject", "changed", "withdrawn"]);
const VERSION_RE = /^v[0-9]{1,3}$/;
const SITE_RE = /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/;
const MAX_BODY = 600; // bytes

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function siteOf(env) {
  const s = env && env.SITE;
  return typeof s === "string" && SITE_RE.test(s) ? s : null;
}

// Only pages on this site (the domain itself or any subdomain, such as www or staging).
function originAllowed(request, site) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return host === site || host.endsWith("." + site);
  } catch (e) {
    return false;
  }
}

async function logChoice(request, env, site) {
  if (!originAllowed(request, site)) return json({ error: "forbidden" }, 403);

  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: "too_long" }, 413);

  let b;
  try { b = JSON.parse(text); } catch (e) { return json({ error: "bad_request" }, 400); }

  const id = b && b.id;
  const page = typeof (b && b.page) === "string" ? b.page.slice(0, 120) : "";
  if (typeof id !== "string" || !ID_RE.test(id)) return json({ error: "bad_request" }, 400);
  if (!ACTIONS.has(b.action)) return json({ error: "bad_request" }, 400);
  if (typeof b.version !== "string" || !VERSION_RE.test(b.version)) return json({ error: "bad_request" }, 400);
  if (typeof b.analytics !== "boolean") return json({ error: "bad_request" }, 400);

  try {
    await env.CONSENT_DB
      .prepare("INSERT INTO consent_log (site, consent_id, created_at, action, analytics, policy_version, page) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)")
      .bind(site, id, new Date().toISOString(), b.action, b.analytics ? 1 : 0, b.version, page)
      .run();
  } catch (e) {
    console.error("consent log error:", String((e && e.message) || e).slice(0, 160));
    return json({ error: "unavailable" }, 503);
  }
  return json({ ok: true }, 201);
}

// GET /api/consent/<consent id>  with  Authorization: Bearer <CONSENT_ADMIN_TOKEN>
// Returns one visitor's history on THIS site only.
async function lookup(request, env, site, id) {
  const token = env.CONSENT_ADMIN_TOKEN;
  const auth = request.headers.get("authorization") || "";
  if (!token || auth !== "Bearer " + token) return json({ error: "forbidden" }, 403);
  if (!ID_RE.test(id)) return json({ error: "bad_request" }, 400);
  const rows = await env.CONSENT_DB
    .prepare("SELECT created_at, action, analytics, policy_version, page FROM consent_log WHERE site = ?1 AND consent_id = ?2 ORDER BY created_at, rowid")
    .bind(site, id)
    .all();
  return json({ site, consent_id: id, records: rows.results || [] });
}

// Returns a Response for /api/consent routes, or null for any other path.
export async function handleConsent(request, env, url) {
  const path = url.pathname;
  if (path !== "/api/consent" && !path.startsWith("/api/consent/")) return null;

  if (path === "/api/consent") {
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  } else if (request.method !== "GET") {
    return json({ error: "method_not_allowed" }, 405);
  }

  const site = siteOf(env);
  if (!site || !env.CONSENT_DB) return json({ error: "not_configured" }, 503);

  if (path === "/api/consent") return logChoice(request, env, site);
  return lookup(request, env, site, path.slice("/api/consent/".length));
}
