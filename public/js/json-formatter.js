// public/js/json-formatter.js
(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function init() {
    const input = byId("json-in");
    const out = byId("json-out");
    const btn = byId("json-format");
    const copy = byId("json-copy");

    if (!input || !out || !btn || !copy) return;

    btn.addEventListener("click", () => {
      try {
        const obj = JSON.parse(input.value);
        out.textContent = JSON.stringify(obj, null, 2);
        copy.disabled = false;
      } catch (e) {
        out.textContent = "Invalid JSON: " + (e && e.message ? e.message : String(e));
        copy.disabled = true;
      }
    });

    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(out.textContent || "");
        const prev = copy.textContent;
        copy.textContent = "Copied!";
        setTimeout(() => (copy.textContent = prev), 1200);
      } catch {
        // Clipboard API can be blocked in some contexts
        alert("Copy failed. Please copy manually.");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

