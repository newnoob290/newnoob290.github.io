/* ------------------------------------------------------------------
   Password screen. Loaded in <head> of every page.
   Not real security: it only keeps casual visitors out.
   The password check is not case sensitive ("Baker" or "baker").
------------------------------------------------------------------- */
(function () {
  var HASH = "530c4fc0e55038578184991c3f991043d4ec5bdceae63ed8f80743d313fb382d";
  var KEY = "enc-gate";
  var root = document.documentElement;

  try { if (localStorage.getItem(KEY) === HASH) return; } catch (e) {}

  root.classList.add("gated");
  var css = document.createElement("style");
  css.textContent =
    "html.gated body > *:not(#gate){display:none !important}" +
    "#gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;background:var(--paper,#fff)}" +
    "#gate form{width:100%;max-width:360px;display:flex;flex-direction:column;gap:.9rem}" +
    "#gate h1{font-family:var(--ui);font-size:1.5rem;margin:0}" +
    "#gate p{font-family:var(--book);color:var(--ink-soft,#5A626A);margin:0}" +
    "#gate input{font:inherit;font-size:1rem;padding:.75rem .9rem;border:1px solid #C9CCC7;border-radius:6px}" +
    "#gate button{font-family:var(--ui);font-weight:600;font-size:1rem;padding:.75rem;border:0;border-radius:6px;background:var(--accent,#14606B);color:#fff;cursor:pointer}" +
    "#gate .err{color:#9E4B2F;font-family:var(--ui);font-size:.9rem;min-height:1.2em}";
  document.head.appendChild(css);

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return ("0" + b.toString(16)).slice(-2);
      }).join("");
    });
  }

  function show() {
    var box = document.createElement("div");
    box.id = "gate";
    box.innerHTML =
      '<form><h1>Michael Wong</h1><p>ENC 1101 portfolio. Enter the password to continue.</p>' +
      '<input type="password" aria-label="Password" placeholder="Password" autocomplete="current-password" required>' +
      '<button type="submit">Enter</button><span class="err" role="alert"></span></form>';
    document.body.insertBefore(box, document.body.firstChild);
    var form = box.querySelector("form");
    var input = box.querySelector("input");
    var err = box.querySelector(".err");
    input.focus();
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      sha256(input.value.trim().toLowerCase()).then(function (h) {
        if (h !== HASH) { err.textContent = "Wrong password. Try again."; input.select(); return; }
        try { localStorage.setItem(KEY, HASH); } catch (e) {}
        box.remove();
        root.classList.remove("gated");
      });
    });
  }

  if (document.body) show();
  else document.addEventListener("DOMContentLoaded", show);
})();
