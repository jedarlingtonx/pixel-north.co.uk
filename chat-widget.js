/* Kit chat assistant: front-end engine. Identical on every site, never edited per site.
   Everything that differs per site (name, wording, colours, fonts, links) is in that site's
   chat-config.js, which sets window.CHAT_ASSISTANT before this file runs.

   Needs the site's Worker to answer POST /api/chat (see worker/chat-handler.js).
   Uses no cookies and no browser storage; the conversation lives only in the open page.
   To switch it off, remove the two <script> tags from the page. */
(function () {
  "use strict";
  if (window.__pnChat) return;
  window.__pnChat = true;

  var cfg = window.CHAT_ASSISTANT || {};

  // ---- Settings with safe defaults -----------------------------------------
  function str(v, d) { return typeof v === "string" && v.trim() ? v : d; }
  function path(v, d) { return typeof v === "string" && /^\/(?!\/)[A-Za-z0-9\-._~\/#?=&%]*$/.test(v) ? v : d; }
  function stack(v, d) { return typeof v === "string" && /^[A-Za-z0-9 ,'"\-]{1,200}$/.test(v) ? v : d; }

  var name = str(cfg.name, "Assistant");
  var T = {
    name: name,
    buttonLabel: str(cfg.buttonLabel, "Ask " + name),
    subtitle: str(cfg.subtitle, "AI assistant"),
    dialogLabel: str(cfg.dialogLabel, "Chat with " + name),
    welcome: str(cfg.welcome, "Hi, I’m " + name + ", the website assistant. Ask me a question about this site."),
    placeholder: str(cfg.placeholder, "Type your question"),
    sendLabel: str(cfg.sendLabel, "Send"),
    thinking: str(cfg.thinking, "Thinking"),
    closeLabel: str(cfg.closeLabel, "Close chat"),
    disclaimer: str(cfg.disclaimer, "AI answers can be wrong. Please don’t share personal details here."),
    privacyLabel: str(cfg.privacyLabel, "Privacy"),
    privacyUrl: path(cfg.privacyUrl, "/privacy"),
    errorText: str(cfg.errorText, "Sorry, I can’t answer right now. Please try again in a moment."),
    apiUrl: path(cfg.apiUrl, "/api/chat")
  };
  var sparkle = cfg.sparkle !== false;
  var emails = (Array.isArray(cfg.allowedEmails) ? cfg.allowedEmails : []).filter(function (e) { return typeof e === "string"; }).map(function (e) { return e.toLowerCase(); });

  // ---- Colours: a few brand colours in, the rest worked out -----------------
  function hex(v, d) {
    if (typeof v !== "string") return d;
    var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v.trim());
    if (!m) return d;
    var h = m[1].length === 3 ? m[1].replace(/(.)/g, "$1$1") : m[1];
    return "#" + h.toLowerCase();
  }
  function rgb(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  function mix(a, b, t) { // t = how much of b
    var x = rgb(a), y = rgb(b), o = "#";
    for (var i = 0; i < 3; i++) { var n = Math.round(x[i] * (1 - t) + y[i] * t); o += (n < 16 ? "0" : "") + n.toString(16); }
    return o;
  }
  function lum(h) {
    var c = rgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function readable(bg, ink) { return ratio(bg, "#ffffff") >= ratio(bg, ink) ? "#ffffff" : ink; } // white or ink, whichever reads better

  var uc = cfg.colors || {};
  var WHITE = "#ffffff";
  var C = {};
  C.brand = hex(uc.brand, "#1d4ed8");
  C.accent = hex(uc.accent, "#d97706");
  C.ink = hex(uc.ink, "#1a1a1a");
  C.brandText = hex(uc.brandText, readable(C.brand, C.ink));
  C.accentText = hex(uc.accentText, readable(C.accent, C.ink));
  C.panel = hex(uc.panel, mix(C.brand, WHITE, 0.92));
  C.accentHover = hex(uc.accentHover, mix(C.accent, WHITE, 0.18));
  C.inputBorder = hex(uc.inputBorder, mix(C.brand, WHITE, 0.7));
  C.line = hex(uc.line, mix(C.brand, WHITE, 0.85));
  C.muted = hex(uc.muted, mix(C.ink, WHITE, 0.25));
  C.dots = hex(uc.dots, mix(C.brand, WHITE, 0.3));

  var F = {
    body: stack(cfg.fonts && cfg.fonts.body, "system-ui, -apple-system, 'Segoe UI', sans-serif"),
    heading: null
  };
  F.heading = stack(cfg.fonts && cfg.fonts.heading, F.body);

  // A small pixel-art face in the brand colours, unless the site supplies its own picture.
  function face() {
    var r = function (x, y, w, h, f) { return "<rect x='" + x + "' y='" + y + "' width='" + w + "' height='" + h + "' fill='" + f + "'/>"; };
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 9' shape-rendering='crispEdges'>" +
      r(0, 0, 9, 9, C.brand) + r(1, 1, 7, 7, C.panel) + r(2, 2, 1, 2, C.ink) + r(6, 2, 1, 2, C.ink) +
      r(2, 5, 1, 1, C.accent) + r(6, 5, 1, 1, C.accent) + r(3, 6, 3, 1, C.accent) + "</svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  var AVATAR = typeof cfg.avatar === "string" && /^(data:image\/|\/[^\/])/.test(cfg.avatar) ? cfg.avatar : face();

  // ---- Styles (everything scoped under #pn-chat / #pn-chat-btn) ------------
  var CSS =
    "#pn-chat-btn{position:fixed;right:16px;bottom:16px;z-index:2147482000;display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;background:" + C.accent + ";color:" + C.accentText + ";font:700 16px/1 " + F.body + ";padding:12px 22px 12px 14px;border-radius:999px;box-shadow:0 0 0 3px #fff,0 6px 20px rgba(0,0,0,.35)}" +
    "#pn-chat-btn:hover{background:" + C.accentHover + "}#pn-chat-btn:focus-visible,#pn-chat input:focus-visible,#pn-chat button:focus-visible{outline:3px solid " + C.accent + ";outline-offset:2px}" +
    "#pn-chat-btn .pnsp{position:relative;display:inline-block;width:26px;height:24px;flex:none;margin-left:2px}" +
    "#pn-chat-btn .pnsp svg{position:absolute;fill:#fff;display:block}" +
    "#pn-chat-btn .pnsp .pnstar1{left:0;top:3px;width:18px;height:18px;filter:drop-shadow(0 0 3px rgba(255,255,255,.7))}" +
    "#pn-chat-btn .pnsp .pnstar2{right:0;top:0;width:10px;height:10px}" +
    "@media (prefers-reduced-motion:no-preference){" +
    "#pn-chat-btn .pnsp .pnstar1{animation:pnTwinkle 2.6s ease-in-out infinite}" +
    "#pn-chat-btn .pnsp .pnstar2{animation:pnTwinkle 2.6s ease-in-out infinite 1.3s}" +
    "@keyframes pnTwinkle{0%,100%{transform:scale(.55) rotate(0);opacity:.45}50%{transform:scale(1.1) rotate(90deg);opacity:1}}}" +
    "#pn-chat-btn img{display:block;width:26px;height:26px;image-rendering:pixelated}" +
    "#pn-chat{position:fixed;right:16px;bottom:16px;z-index:2147482001;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100dvh - 32px));display:none;flex-direction:column;background:#fff;color:" + C.ink + ";border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.35);font:400 15px/1.45 " + F.body + ";color-scheme:light}" +
    "#pn-chat.open{display:flex}" +
    "#pn-chat header{background:" + C.brand + ";color:" + C.brandText + ";padding:14px 16px;display:flex;align-items:center;justify-content:space-between}" +
    "#pn-chat header .who{display:flex;align-items:center;gap:12px}#pn-chat header .who img{width:44px;height:44px;image-rendering:pixelated;flex:none;border:2px solid #fff;box-sizing:border-box}" +
    "#pn-chat header b{font:700 18px " + F.heading + ";letter-spacing:-.3px}#pn-chat header span{display:block;font-size:12.5px;opacity:.85}" +
    "#pn-chat header button{background:transparent;border:0;color:" + C.brandText + ";font-size:26px;line-height:1;cursor:pointer;padding:2px 8px;border-radius:8px}" +
    "#pn-chat .log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:14px;display:flex;flex-direction:column;gap:10px;background:" + C.panel + "}" +
    "#pn-chat .m{max-width:86%;padding:10px 14px;border-radius:16px;white-space:pre-wrap;overflow-wrap:anywhere}" +
    "#pn-chat .m.bot{background:#fff;color:" + C.ink + ";align-self:flex-start;border-bottom-left-radius:4px}" +
    "#pn-chat .m.me{background:" + C.brand + ";color:" + C.brandText + ";align-self:flex-end;border-bottom-right-radius:4px}" +
    "#pn-chat .m a{color:inherit;text-decoration:underline}" +
    "#pn-chat .m.wait{color:" + C.muted + "}" +
    "#pn-chat .pndots i{display:inline-block;width:6px;height:6px;margin-left:4px;border-radius:50%;background:" + C.dots + ";vertical-align:middle;opacity:.45}" +
    "@media (prefers-reduced-motion:no-preference){#pn-chat .pndots i{animation:pnBounce 1.2s ease-in-out infinite}" +
    "#pn-chat .pndots i:nth-child(2){animation-delay:.18s}#pn-chat .pndots i:nth-child(3){animation-delay:.36s}" +
    "@keyframes pnBounce{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-6px);opacity:1}}}" +
    "#pn-chat .note{font-size:12.5px;color:" + C.muted + ";background:#fff;border-top:1px solid " + C.line + ";padding:8px 14px}" +
    "#pn-chat .note a{color:inherit}" +
    "#pn-chat form{display:flex;flex-direction:row;align-items:stretch;gap:8px;margin:0;padding:10px 12px;background:#fff;border-radius:0;border-top:1px solid " + C.line + "}" +
    "#pn-chat form input{flex:1 1 auto;width:auto;min-width:0;margin:0;font:inherit;font-size:16px;padding:10px 14px;border:2px solid " + C.inputBorder + ";border-radius:999px;background:#fff;color:" + C.ink + "}" +
    "#pn-chat form button{flex:none;width:auto;min-height:46px;margin:0;border:0;cursor:pointer;background:" + C.accent + ";color:" + C.accentText + ";font:700 16px " + F.body + ";padding:0 24px;border-radius:999px}" +
    "#pn-chat form button:hover{background:" + C.accentHover + "}#pn-chat form button:disabled{opacity:.5;cursor:default}" +
    "@media (max-width:480px){#pn-chat{right:8px;bottom:8px;width:calc(100vw - 16px);height:calc(100dvh - 16px)}}";

  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  // ---- Markup (site text goes in as text, never as HTML) -------------------
  function el(tag, props, kids) {
    var e = document.createElement(tag), k;
    for (k in props || {}) { if (k === "text") e.textContent = props[k]; else e.setAttribute(k, props[k]); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  var STAR = "<path d='M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z'/>";

  var btn = el("button", { id: "pn-chat-btn", type: "button", "aria-haspopup": "dialog", "aria-expanded": "false" });
  btn.appendChild(el("img", { alt: "", src: AVATAR }));
  btn.appendChild(document.createTextNode(T.buttonLabel));
  if (sparkle) {
    var sp = el("span", { "class": "pnsp", "aria-hidden": "true" });
    sp.innerHTML = "<svg class='pnstar1' viewBox='0 0 24 24'>" + STAR + "</svg><svg class='pnstar2' viewBox='0 0 24 24'>" + STAR + "</svg>";
    btn.appendChild(sp);
  }

  var closeBtn = el("button", { type: "button", "aria-label": T.closeLabel, text: "×" });
  var box = el("div", { id: "pn-chat", role: "dialog", "aria-label": T.dialogLabel }, [
    el("header", {}, [
      el("div", { "class": "who" }, [
        el("img", { alt: "", src: AVATAR }),
        el("div", {}, [el("b", { text: T.name }), el("span", { text: T.subtitle })])
      ]),
      closeBtn
    ]),
    el("div", { "class": "log", role: "log", "aria-live": "polite" }),
    el("div", { "class": "note" }, [document.createTextNode(T.disclaimer + " "), el("a", { href: T.privacyUrl, text: T.privacyLabel })]),
    el("form", {}, [
      el("input", { type: "text", maxlength: "500", placeholder: T.placeholder, "aria-label": T.placeholder, autocomplete: "off" }),
      el("button", { type: "submit", text: T.sendLabel })
    ])
  ]);

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // Fade the button out near the bottom of a scrolling page so it never covers
  // footer content (e.g. social icons). It returns when you scroll back up.
  var ticking = false;
  var place = function () {
    ticking = false;
    var de = document.documentElement;
    var scrollable = de.scrollHeight > window.innerHeight + 300;
    var atEnd = window.pageYOffset + window.innerHeight >= de.scrollHeight - 140;
    var away = scrollable && atEnd;
    btn.style.opacity = away ? "0" : "1";
    btn.style.visibility = away ? "hidden" : "visible";
    btn.style.pointerEvents = away ? "none" : "auto";
  };
  btn.style.transition = "opacity .25s ease, visibility .25s";
  var queue = function () { if (!ticking) { ticking = true; window.requestAnimationFrame(place); } };
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  place();

  var log = box.querySelector(".log");
  var form = box.querySelector("form");
  var input = box.querySelector("input");
  var send = form.querySelector("button");
  var history = [];
  var busy = false;

  function add(text, cls) {
    var d = document.createElement("div");
    d.className = "m " + cls;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  // The Worker only sends links from the site's approved list. This is a second check:
  // a path on this site, or mailto: for an address listed in allowedEmails. Anything else
  // (another website, javascript:, data:) is shown as plain text.
  function linkOk(u) {
    if (/^\/(?!\/)[A-Za-z0-9\-._~\/#?=&%]*$/.test(u)) return true;
    var mt = /^mailto:([^?\s]+)$/i.exec(u);
    return !!mt && emails.indexOf(mt[1].toLowerCase()) !== -1;
  }

  // Show a reply as text, turning [label](url) into links, but only for approved urls.
  function richText(node, text) {
    node.textContent = "";
    var re = /\[([^\]\n]{1,60})\]\(([^)\s]{1,200})\)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (linkOk(m[2])) {
        var a = document.createElement("a");
        a.href = m[2];
        a.textContent = m[1];
        if (m[2].indexOf("/#") === 0) a.addEventListener("click", function () { setTimeout(close, 0); });
        node.appendChild(a);
      } else {
        node.appendChild(document.createTextNode(m[1]));
      }
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
  }

  function fallback() {
    var d = add("", "bot");
    richText(d, T.errorText);
  }

  function open() {
    box.classList.add("open");
    btn.style.display = "none";
    btn.setAttribute("aria-expanded", "true");
    if (!log.children.length) add(T.welcome, "bot");
    lock(true);
    fit();
    if (!isPhone()) input.focus();
  }

  // On phones the keyboard shrinks the visible area but not the page, which
  // pushed the top of the chat off screen. Size the panel to what is visible.
  function isPhone() { return window.matchMedia("(max-width:480px)").matches; }

  // Freeze the page behind the panel so iOS doesn't scroll it when the keyboard opens.
  var lockedY = null;
  function lock(on) {
    if (!isPhone()) on = false;
    var b = document.body;
    if (on && lockedY === null) {
      lockedY = window.pageYOffset;
      b.style.position = "fixed"; b.style.top = -lockedY + "px"; b.style.left = "0"; b.style.right = "0"; b.style.width = "100%";
    } else if (!on && lockedY !== null) {
      b.style.position = b.style.top = b.style.left = b.style.right = b.style.width = "";
      window.scrollTo(0, lockedY); lockedY = null;
    }
  }

  var fitQueued = false;
  function queueFit() { if (!fitQueued) { fitQueued = true; window.requestAnimationFrame(function () { fitQueued = false; fit(); }); } }

  function fit() {
    var vv = window.visualViewport;
    var phone = isPhone();
    if (vv && phone && box.classList.contains("open")) {
      box.style.top = Math.round(vv.offsetTop + 8) + "px";
      box.style.bottom = "auto";
      box.style.height = Math.max(200, Math.round(vv.height - 16)) + "px";
      log.scrollTop = log.scrollHeight;
    } else {
      box.style.top = box.style.bottom = box.style.height = "";
    }
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", queueFit);
    window.visualViewport.addEventListener("scroll", queueFit);
  }

  function close() {
    box.classList.remove("open");
    lock(false);
    fit();
    btn.style.display = "";
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }

  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  box.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    add(q, "me");
    history.push({ role: "user", content: q });
    var wait = add(T.thinking, "bot wait");
    var dots = document.createElement("span");
    dots.className = "pndots";
    dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = "<i></i><i></i><i></i>";
    wait.appendChild(dots);

    fetch(T.apiUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-6) })
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("bad status")); })
      .then(function (data) {
        if (!data || !data.reply) throw new Error("empty");
        wait.className = "m bot";
        richText(wait, data.reply);
        history.push({ role: "assistant", content: data.reply });
      })
      .catch(function () {
        wait.remove();
        history.pop();
        fallback();
        input.value = q;
      })
      .then(function () {
        busy = false;
        send.disabled = false;
        log.scrollTop = log.scrollHeight;
        input.focus();
      });
  });
})();
