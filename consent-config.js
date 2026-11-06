/*
  Cookie control settings for pixel-north.co.uk. Edit this file, never consent.js.
  (consent.js is the shared Pixel North cookie control kit, identical on every site.)
*/
window.COOKIE_CONTROL = {
  gaId: "G-19MLYWMYX5",
  cookieName: "pn_consent",
  version: "v2",                   // bump to ask everyone again after a policy change
  acceptDays: 365,
  declineDays: 365,
  policyUrl: "/cookies",
  logUrl: "/api/consent",          // audit log (worker/consent-log.js)
  colors: { brand: "#5B21E6", text: "#1A1033", background: "#ffffff", focus: "#FF3D8B" },
  fonts: { body: "'DM Sans', system-ui, sans-serif", heading: "Outfit, system-ui, sans-serif" }
};
