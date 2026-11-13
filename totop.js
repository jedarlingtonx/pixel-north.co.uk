/* Back to top: a small button, bottom left, that only appears as you reach the end of a long page. */
(function () {
  if (document.getElementById("totop")) return;
  var css = document.createElement("style");
  css.textContent =
    ".totop{position:fixed;left:16px;bottom:16px;z-index:2147480000;width:44px;height:44px;box-sizing:border-box;border-radius:50%;border:2px solid #5B21E6;background:#fff;color:#5B21E6;display:grid;place-items:center;padding:0;cursor:pointer;box-shadow:0 6px 18px rgba(26,16,51,.18);opacity:0;transform:translateY(8px);visibility:hidden;transition:opacity .25s ease,transform .25s ease,visibility 0s linear .25s}" +
    ".totop.on{opacity:1;transform:none;visibility:visible;transition:opacity .25s ease,transform .25s ease}" +
    ".totop:hover{background:#5B21E6;color:#fff}" +
    ".totop:focus-visible{outline:3px solid #FF3D8B;outline-offset:2px}" +
    ".totop svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}" +
    "@media (prefers-reduced-motion:reduce){.totop{transition:none;transform:none}}";
  document.head.appendChild(css);
  var b = document.createElement("button");
  b.type = "button"; b.id = "totop"; b.className = "totop"; b.setAttribute("aria-label", "Back to top");
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(b);
  var on = false;
  function upd() {
    var d = document.documentElement, h = window.innerHeight;
    var long = d.scrollHeight > h * 2;
    var v = long && (window.pageYOffset || d.scrollTop) + h > d.scrollHeight - Math.max(500, h * 0.6);
    if (v !== on) { on = v; b.classList.toggle("on", v); }
  }
  addEventListener("scroll", upd, { passive: true });
  addEventListener("resize", upd);
  upd();
  b.addEventListener("click", function () {
    var r = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
    window.scrollTo({ top: 0, behavior: r ? "auto" : "smooth" });
    var a = document.querySelector("header a, .site-head a");
    if (a) a.focus({ preventScroll: true });
  });
})();
