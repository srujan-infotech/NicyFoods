// js/policy-page.js
// Loads content for Disclaimer / Return / Refund / Cancellation policy pages
// from the backend (GET /api/site-settings), so admins can edit the text
// from the admin panel (policies.html) without touching any code.
//
// Each policy .html page must set:
//   <body data-policy-field="disclaimer">   (or returnPolicy / refundPolicy / cancellationPolicy)
// and include:
//   <div id="policy-content">Loading…</div>

(function () {
  const POLICY_API_BASE_URL = "https://nicyfoods.com";
  const POLICY_API_URL = `${POLICY_API_BASE_URL}/api/site-settings`;

  document.addEventListener("DOMContentLoaded", () => {
    const field = document.body.getAttribute("data-policy-field");
    const container = document.getElementById("policy-content");
    if (!field || !container) return;

    fetch(POLICY_API_URL)
      .then((res) => res.json())
      .then((json) => {
        if (json && json.success && json.data && json.data[field]) {
          container.innerHTML = textToParagraphs(json.data[field]);
        } else {
          container.innerHTML = textToParagraphs(container.dataset.fallback || "");
        }
      })
      .catch(() => {
        container.innerHTML = textToParagraphs(container.dataset.fallback || "");
      });
  });

  function textToParagraphs(text) {
    if (!text) return "<p>Content coming soon.</p>";
    return text
      .split(/\n{2,}|\r\n\r\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
