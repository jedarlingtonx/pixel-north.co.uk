/*
  Pixel North cookie consent.
  Google Analytics is loaded only after the visitor chooses "Accept analytics".
  GA_ID is the Pixel North GA4 measurement ID.
*/
(function () {
  "use strict";

  var GA_ID = "G-19MLYWMYX5";
  var COOKIE = "pn_consent";
  var VERSION = "v1"; // change this to ask everyone again after a policy change
  var MAX_AGE = 60 * 60 * 24 * 365; // 12 months
  var root, lastFocus;

  function readChoice() {
    var m = document.cookie.match(new RegExp("(?:^|; )" + COOKIE + "=([^;]*)"));
    if (!m) return null;
    if (m[1] === VERSION + "-yes") return true;
    if (m[1] === VERSION + "-no") return false;
    return null;
  }

  function saveChoice(yes) {
    document.cookie = COOKIE + "=" + VERSION + (yes ? "-yes" : "-no") +
      "; max-age=" + MAX_AGE + "; path=/; SameSite=Lax" +
      (location.protocol === "https:" ? "; Secure" : "");
  }

  function gaConfigured() {
    return /^G-[A-Z0-9]+$/.test(GA_ID) && GA_ID !== "G-XXXXXXXXXX";
  }

  function loadGA() {
    if (!gaConfigured() || window.__pnGA) return;
    window.__pnGA = true;
    window["ga-disable-" + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    // Analytics only: switch off Google's advertising features, whatever the admin settings say
    window.gtag("config", GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }

  function removeGA() {
    if (gaConfigured()) window["ga-disable-" + GA_ID] = true;
    var names = document.cookie.split("; ").map(function (c) { return c.split("=")[0]; })
      .filter(function (n) { return n === "_ga" || n === "_gid" || n.indexOf("_ga_") === 0 || n.indexOf("_gat") === 0; });
    var parts = location.hostname.split(".");
    var domains = [""];
    for (var i = 0; i < parts.length - 1; i++) {
      var d = parts.slice(i).join(".");
      domains.push(d, "." + d);
    }
    names.forEach(function (n) {
      domains.forEach(function (d) {
        document.cookie = n + "=; max-age=0; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  var CSS =
    "#pn-cookie{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;padding:12px 12px calc(12px + env(safe-area-inset-bottom,0px));font:400 15px/1.5 'DM Sans',system-ui,sans-serif;color:#1A1033;color-scheme:light;pointer-events:none}" +
    "#pn-cookie[hidden]{display:none}" +
    ".pnc-box{pointer-events:auto;max-width:760px;margin:0 auto;background:#fff;border:2px solid #5B21E6;border-radius:18px;padding:18px 20px;box-shadow:0 8px 30px rgba(26,16,51,.25)}" +
    ".pnc-box h2{margin:0 0 6px;font:700 20px/1.2 Outfit,system-ui,sans-serif;color:#1A1033}" +
    ".pnc-box p{margin:0 0 12px}.pnc-box a{color:#5B21E6}" +
    ".pnc-row{display:flex;flex-wrap:wrap;gap:10px}" +
    ".pnc-btn{font:500 16px 'DM Sans',system-ui,sans-serif;background:#5B21E6;color:#fff;border:2px solid #5B21E6;border-radius:999px;padding:10px 20px;cursor:pointer}" +
    ".pnc-alt{background:#fff;color:#5B21E6}" +
    ".pnc-btn:focus-visible,.pnc-box a:focus-visible,.pnc-opt input:focus-visible{outline:3px solid #FF3D8B;outline-offset:2px}" +
    ".pnc-opt{display:flex;gap:12px;align-items:flex-start;margin:0 0 12px;cursor:pointer}" +
    ".pnc-opt input{width:22px;height:22px;margin:2px 0 0;accent-color:#5B21E6;flex:0 0 auto}";

  var HTML =
    '<div class="pnc-box">' +
    '<div id="pn-view-main">' +
    '<h2 id="pn-title-main">Cookies on this site</h2>' +
    '<p>We’d like to use Analytics cookies to see how you use this site. They stay off unless you say yes. A cookie that remembers your choice is always on. <a href="cookies.html">Cookie policy</a></p>' +
    '<div class="pnc-row">' +
    '<button type="button" class="pnc-btn" data-act="accept">Accept analytics</button>' +
    '<button type="button" class="pnc-btn" data-act="reject">Reject analytics</button>' +
    '<button type="button" class="pnc-btn pnc-alt" data-act="manage">Choose settings</button>' +
    '</div></div>' +
    '<div id="pn-view-prefs" hidden>' +
    '<h2 id="pn-title-prefs">Cookie settings</h2>' +
    '<label class="pnc-opt"><input type="checkbox" checked disabled><span><strong>Essential</strong><br>Remembers your cookie choice. Always on.</span></label>' +
    '<label class="pnc-opt"><input type="checkbox" id="pn-analytics"><span><strong>Analytics</strong><br>Google Analytics cookies that count visits and show which pages are used. Off unless you turn them on.</span></label>' +
    '<div class="pnc-row">' +
    '<button type="button" class="pnc-btn" data-act="save">Save choices</button>' +
    '<button type="button" class="pnc-btn pnc-alt" data-act="cancel">Cancel</button>' +
    '</div></div></div>';

  function pad() {
    document.body.style.paddingBottom = root.hidden ? "" : root.offsetHeight + "px";
  }

  function show(view) {
    var prefs = view === "prefs";
    root.querySelector("#pn-view-main").hidden = prefs;
    root.querySelector("#pn-view-prefs").hidden = !prefs;
    root.setAttribute("aria-labelledby", prefs ? "pn-title-prefs" : "pn-title-main");
    root.hidden = false;
    pad();
  }

  function hide() {
    root.hidden = true;
    pad();
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); lastFocus = null; }
  }

  function choose(yes) {
    saveChoice(yes);
    if (yes) loadGA(); else removeGA();
    hide();
  }

  function openSettings(from) {
    lastFocus = from || null;
    root.querySelector("#pn-analytics").checked = readChoice() === true;
    show("prefs");
    root.querySelector("#pn-analytics").focus();
  }

  function build() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    root = document.createElement("div");
    root.id = "pn-cookie";
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "false");
    root.innerHTML = HTML;
    document.body.appendChild(root);

    root.addEventListener("click", function (ev) {
      var act = ev.target && ev.target.getAttribute && ev.target.getAttribute("data-act");
      if (!act) return;
      if (act === "accept") choose(true);
      else if (act === "reject") choose(false);
      else if (act === "manage") openSettings(null);
      else if (act === "save") choose(root.querySelector("#pn-analytics").checked);
      else if (act === "cancel") { if (readChoice() === null) show("main"); else hide(); }
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && !root.hidden && readChoice() !== null) hide();
    });
    window.addEventListener("resize", pad);

    document.querySelectorAll("[data-cookie-settings]").forEach(function (el) {
      el.addEventListener("click", function (ev) { ev.preventDefault(); openSettings(el); });
    });
    window.pnOpenCookieSettings = function () { openSettings(null); };
  }

  function init() {
    build();
    var choice = readChoice();
    if (choice === true) loadGA();
    else removeGA(); // clear any analytics cookies set before consent
    if (choice === null) show("main");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
