/* Pixel North website assistant widget. Needs /api/chat (functions/api/chat.js).
   To switch it off, remove the <script src="/chat-widget.js"> tag from the page. */
(function () {
  "use strict";
  if (window.__pnChat) return;
  window.__pnChat = true;

  var AVATAR = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%209%209%22%20shape-rendering%3D%22crispEdges%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%229%22%20height%3D%229%22%20fill%3D%22%235B21E6%22%2F%3E%3Crect%20x%3D%221%22%20y%3D%221%22%20width%3D%227%22%20height%3D%227%22%20fill%3D%22%23F1EBFF%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%221%22%20height%3D%222%22%20fill%3D%22%231A1033%22%2F%3E%3Crect%20x%3D%226%22%20y%3D%222%22%20width%3D%221%22%20height%3D%222%22%20fill%3D%22%231A1033%22%2F%3E%3Crect%20x%3D%222%22%20y%3D%225%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23FF3D8B%22%2F%3E%3Crect%20x%3D%226%22%20y%3D%225%22%20width%3D%221%22%20height%3D%221%22%20fill%3D%22%23FF3D8B%22%2F%3E%3Crect%20x%3D%223%22%20y%3D%226%22%20width%3D%223%22%20height%3D%221%22%20fill%3D%22%23FF3D8B%22%2F%3E%3C%2Fsvg%3E";

  var CSS =
    "#pn-chat-btn{position:fixed;right:16px;bottom:16px;z-index:2147482000;display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;background:#FF3D8B;color:#1A1033;font:700 16px/1 'DM Sans',system-ui,sans-serif;padding:12px 22px 12px 14px;border-radius:999px;box-shadow:0 0 0 3px #fff,0 6px 20px rgba(26,16,51,.4)}" +
    "#pn-chat-btn:hover{background:#FF5A9F}#pn-chat-btn:focus-visible,#pn-chat input:focus-visible,#pn-chat button:focus-visible{outline:3px solid #FF3D8B;outline-offset:2px}" +
    "#pn-chat-btn .pnsp{position:relative;display:inline-block;width:26px;height:24px;flex:none;margin-left:2px}" +
    "#pn-chat-btn .pnsp svg{position:absolute;fill:#fff;display:block}" +
    "#pn-chat-btn .pnsp .pnstar1{left:0;top:3px;width:18px;height:18px;filter:drop-shadow(0 0 3px rgba(255,255,255,.7))}" +
    "#pn-chat-btn .pnsp .pnstar2{right:0;top:0;width:10px;height:10px}" +
    "@media (prefers-reduced-motion:no-preference){" +
    "#pn-chat-btn .pnsp .pnstar1{animation:pnTwinkle 2.6s ease-in-out infinite}" +
    "#pn-chat-btn .pnsp .pnstar2{animation:pnTwinkle 2.6s ease-in-out infinite 1.3s}" +
    "@keyframes pnTwinkle{0%,100%{transform:scale(.55) rotate(0);opacity:.45}50%{transform:scale(1.1) rotate(90deg);opacity:1}}}" +
    "#pn-chat-btn img{display:block;width:26px;height:26px;image-rendering:pixelated}" +
    "#pn-chat{position:fixed;right:16px;bottom:16px;z-index:2147482001;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100dvh - 32px));display:none;flex-direction:column;background:#fff;color:#1A1033;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(26,16,51,.35);font:400 15px/1.45 'DM Sans',system-ui,sans-serif;color-scheme:light}" +
    "#pn-chat.open{display:flex}" +
    "#pn-chat header{background:#5B21E6;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}" +
    "#pn-chat header .who{display:flex;align-items:center;gap:12px}#pn-chat header .who img{width:44px;height:44px;image-rendering:pixelated;flex:none;border:2px solid #fff;box-sizing:border-box}" +
    "#pn-chat header b{font:700 18px 'Outfit',system-ui,sans-serif;letter-spacing:-.3px}#pn-chat header span{display:block;font-size:12.5px;opacity:.85}" +
    "#pn-chat header button{background:transparent;border:0;color:#fff;font-size:26px;line-height:1;cursor:pointer;padding:2px 8px;border-radius:8px}" +
    "#pn-chat .log{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:14px;display:flex;flex-direction:column;gap:10px;background:#F1EBFF}" +
    "#pn-chat .m{max-width:86%;padding:10px 14px;border-radius:16px;white-space:pre-wrap;overflow-wrap:anywhere}" +
    "#pn-chat .m.bot{background:#fff;align-self:flex-start;border-bottom-left-radius:4px}" +
    "#pn-chat .m.me{background:#5B21E6;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}" +
    "#pn-chat .m a{color:inherit;text-decoration:underline}" +
    "#pn-chat .m.wait{color:#6B5B95}" +
    "#pn-chat .pndots i{display:inline-block;width:6px;height:6px;margin-left:4px;border-radius:50%;background:#8B5CF6;vertical-align:middle;opacity:.45}" +
    "@media (prefers-reduced-motion:no-preference){#pn-chat .pndots i{animation:pnBounce 1.2s ease-in-out infinite}" +
    "#pn-chat .pndots i:nth-child(2){animation-delay:.18s}#pn-chat .pndots i:nth-child(3){animation-delay:.36s}" +
    "@keyframes pnBounce{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-6px);opacity:1}}}" +
    "#pn-chat .note{font-size:12.5px;color:#4A3F6B;background:#fff;border-top:1px solid #E3D9FA;padding:8px 14px}" +
    "#pn-chat form{display:flex;flex-direction:row;align-items:stretch;gap:8px;margin:0;padding:10px 12px;background:#fff;border-radius:0;border-top:1px solid #E3D9FA}" +
    "#pn-chat form input{flex:1 1 auto;width:auto;min-width:0;margin:0;font:inherit;font-size:16px;padding:10px 14px;border:2px solid #CFC0F5;border-radius:999px;background:#fff;color:#1A1033}" +
    "#pn-chat form button{flex:none;width:auto;min-height:46px;margin:0;border:0;cursor:pointer;background:#FF3D8B;color:#1A1033;font:700 16px 'DM Sans',system-ui,sans-serif;padding:0 24px;border-radius:999px}" +
    "#pn-chat form button:hover{background:#FF5A9F}#pn-chat form button:disabled{opacity:.5;cursor:default}" +
    "@media (max-width:480px){#pn-chat{right:8px;bottom:8px;width:calc(100vw - 16px);height:calc(100dvh - 16px)}}";

  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.id = "pn-chat-btn";
  btn.type = "button";
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = '<img alt="" src="' + AVATAR + '">Ask Pixel<span class="pnsp" aria-hidden="true"><svg class="pnstar1" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"/></svg><svg class="pnstar2" viewBox="0 0 24 24"><path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"/></svg></span>';

  var box = document.createElement("div");
  box.id = "pn-chat";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Chat with Pixel, the Pixel North assistant");
  box.innerHTML =
    '<header><div class="who"><img alt="" src="' + AVATAR + '"><div><b>Pixel</b><span>Pixel North\u2019s AI assistant, not James</span></div></div><button type="button" aria-label="Close chat">&times;</button></header>' +
    '<div class="log" role="log" aria-live="polite"></div>' +
    '<div class="note">AI answers can be wrong, and quotations only come from James. Please don’t share personal details here. <a href="/privacy.html">Privacy</a></div>' +
    '<form><input type="text" maxlength="500" placeholder="Type your question" aria-label="Your question" autocomplete="off"><button type="submit">Send</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // Fade the button out near the bottom of a scrolling page so it never covers
  // footer content (e.g. the Facebook icon). It returns when you scroll back up.
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
  var closeBtn = box.querySelector("header button");
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

  var ALLOWED = {
    "/privacy.html": 1, "/cookies.html": 1, "/free-website-terms.html": 1, "/#contact": 1, "/#services": 1, "/#quotes": 1, "/#why": 1,
    "mailto:james@pixel-north.co.uk": 1
  };

  // Show a reply as text, turning [label](url) into links, but only for approved urls.
  function richText(el, text) {
    el.textContent = "";
    var re = /\[([^\]\n]{1,60})\]\(([^)\s]{1,200})\)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (ALLOWED[m[2]] === 1) {
        var a = document.createElement("a");
        a.href = m[2];
        a.textContent = m[1];
        if (m[2].indexOf("/#") === 0) a.addEventListener("click", function () { setTimeout(close, 0); });
        el.appendChild(a);
      } else {
        el.appendChild(document.createTextNode(m[1]));
      }
      last = re.lastIndex;
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
  }

  function fallback() {
    var d = add("", "bot");
    richText(d, "Sorry, the AI models I use aren\u2019t available right now. Please try again in a moment, or contact James directly using the [contact form](/#contact).");
  }

  function open() {
    box.classList.add("open");
    btn.style.display = "none";
    btn.setAttribute("aria-expanded", "true");
    if (!log.children.length) add("Hi, I’m Pixel, the Pixel North website assistant. Ask me about the services, how quotes work, or how to get in touch.", "bot");
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
    var wait = add("Thinking", "bot wait");
    var dots = document.createElement("span");
    dots.className = "pndots";
    dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = "<i></i><i></i><i></i>";
    wait.appendChild(dots);

    fetch("/api/chat", {
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
