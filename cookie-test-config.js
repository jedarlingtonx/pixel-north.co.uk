/*
  TEMPORARY settings for the hidden cookie test page only (cookie-test.html).
  The rest of the site keeps using consent-config.js (analytics only).
  Separate cookie name so test choices never change how the real site treats a visitor.
  No gaId on purpose: real Google Analytics is not loaded, so test visits do not appear in the live analytics.
*/
window.COOKIE_CONTROL = {
  categories: { analytics: true, preferences: true, media: true, marketing: true },
  cookieName: "pn_consent_test",
  version: "v1",
  acceptDays: 1,
  declineDays: 1,
  policyUrl: "/cookies",
  logUrl: "/api/consent",          // test choices are logged with page /cookie-test so they are easy to find
  colors: { brand: "#5B21E6", text: "#1A1033", background: "#ffffff", focus: "#FF3D8B" },
  fonts: { body: "'DM Sans', system-ui, sans-serif", heading: "Outfit, system-ui, sans-serif" }
};
