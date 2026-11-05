-- Consent audit trail for pixel-north.co.uk (Cloudflare D1).
-- Create once with:  npx wrangler d1 execute pixel-north-consent --remote --file=worker/schema.sql
-- Append-only: the Worker only ever inserts. Nothing here identifies a person:
-- consent_id is a random UUID held in the visitor's own consent cookie.
CREATE TABLE IF NOT EXISTS consent_log (
  consent_id     TEXT    NOT NULL,           -- random UUID from the visitor's pn_consent cookie
  created_at     TEXT    NOT NULL,           -- ISO 8601 UTC, set by the server
  action         TEXT    NOT NULL,           -- accept | reject | changed | withdrawn
  analytics      INTEGER NOT NULL,           -- 1 = analytics cookies allowed, 0 = not allowed
  policy_version TEXT    NOT NULL,           -- consent.js VERSION the visitor saw, e.g. v2
  page           TEXT    NOT NULL DEFAULT '' -- page path where the choice was made
);
CREATE INDEX IF NOT EXISTS consent_log_id ON consent_log (consent_id);
