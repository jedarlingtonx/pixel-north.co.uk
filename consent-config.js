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
  text: {
    intro: "We’d like to use analytics cookies to see how you use this site. By clicking \"Accept all\", you consent to our use of cookies. Essential cookies, which remember your choice and help keep the site secure, are always on.",
    accept: "Accept all",
    reject: "Reject all",
    essentialDesc: "Remembers your cookie choice and helps keep the site secure. Always on."
  },
  cookies: {
    essential: [
      { name: "cf_clearance", duration: "Up to 30 minutes", purpose: "Set by Cloudflare, our host, to tell real visitors from bots and keep the site secure. It may not be set for every visitor." }
    ]
  },
  fonts: { body: "'DM Sans', system-ui, sans-serif", heading: "Outfit, system-ui, sans-serif" }
};
