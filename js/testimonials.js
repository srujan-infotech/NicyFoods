/**
 * testimonials.js
 * Connects the "What Customers Are Saying" section to the backend API
 * (GET /api/testimonials) and dynamically renders the review cards,
 * then wires up the existing carousel (prev/next/dots) logic.
 *
 * Usage: include this script at the end of the page, after the
 * testimonials <section> markup:
 *   <script src="/js/testimonials.js"></script>
 */

(() => {
  // ---- Config -------------------------------------------------------
  const API_BASE_URL = "https://dbms.srujaninfotech.com/api"; // change to your deployed backend URL
  const TESTIMONIALS_LIST_URL = `${API_BASE_URL}/testimonials?visible=true&limit=20&sort=-order,-reviewDate`;

  // ---- DOM refs -------------------------------------------------------
  const track = document.getElementById("testi-track");
  const dotsWrap = document.getElementById("testi-dots");
  const prevBtn = document.getElementById("testi-prev");
  const nextBtn = document.getElementById("testi-next");

  if (!track) return; // section not present on this page

  // ---- Helpers -------------------------------------------------------

  // "2024-05-01T..." -> "2 months ago"
  function timeAgo(dateString) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const ranges = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];

    for (const [unit, secondsInUnit] of ranges) {
      const value = Math.floor(seconds / secondsInUnit);
      if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
    return "just now";
  }

  function escapeHtml(str = "") {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function starsSvg(count = 5) {
    const starPath =
      '<path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L10 15l-5.6 3.1 1.4-6.3L1 7.5l6.4-.6z"/>';
    let svgs = "";
    for (let i = 0; i < 5; i++) {
      const filled = i < count;
      svgs += `<svg viewBox="0 0 20 20" style="opacity:${filled ? 1 : 0.25}">${starPath}</svg>`;
    }
    return svgs;
  }

  const GOOGLE_ICON = `
    <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>`;

  function cardHtml(t) {
    const initial = escapeHtml(t.initial || (t.name ? t.name.charAt(0).toUpperCase() : "?"));
    const color = t.avatarColor || "#A63A2E";
    const name = escapeHtml(t.name);
    const review = escapeHtml(t.reviewText);
    const when = timeAgo(t.reviewDate || t.createdAt);

    return `
      <div class="testi-card">
        <div class="testi-card-inner">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="testi-avatar" style="background:${color};">${initial}</div>
              <div>
                <p class="font-semibold text-jaggery text-sm">${name}</p>
                <div class="testi-stars flex gap-0.5 mt-1">${starsSvg(t.rating)}</div>
              </div>
            </div>
            ${GOOGLE_ICON}
          </div>
          <p class="testi-text text-sm text-slate-600 leading-relaxed flex-1">${review}</p>
          <button class="testi-read-more text-xs font-semibold text-kumkum mt-2 self-start hover:underline">Read more</button>
          <p class="text-xs text-slate-400 mt-3">${when}</p>
        </div>
      </div>`;
  }

  // ---- Carousel (dots / prev / next) --------------------------------
  let currentIndex = 0;

  function getCardWidth() {
    const card = track.querySelector(".testi-card");
    if (!card) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || 0);
    return card.offsetWidth + gap;
  }

  function visibleCardCount() {
    const cardWidth = getCardWidth();
    if (!cardWidth) return 1;
    return Math.max(1, Math.floor(track.clientWidth / cardWidth));
  }

  function buildDots(totalCards) {
    if (!dotsWrap) return;
    const perView = visibleCardCount();
    const pageCount = Math.max(1, totalCards - perView + 1);

    dotsWrap.innerHTML = "";
    for (let i = 0; i < pageCount; i++) {
      const dot = document.createElement("button");
      dot.className = "testi-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to review ${i + 1}`);
      dot.addEventListener("click", () => goToIndex(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    [...dotsWrap.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goToIndex(index) {
    const cards = track.querySelectorAll(".testi-card");
    const perView = visibleCardCount();
    const maxIndex = Math.max(0, cards.length - perView);

    currentIndex = Math.min(Math.max(index, 0), maxIndex);
    const cardWidth = getCardWidth();
    track.scrollTo({ left: currentIndex * cardWidth, behavior: "smooth" });
    updateDots();
  }

  function initCarouselControls() {
    const cards = track.querySelectorAll(".testi-card");
    buildDots(cards.length);
    currentIndex = 0;
    updateDots();

    if (prevBtn) prevBtn.onclick = () => goToIndex(currentIndex - 1);
    if (nextBtn) nextBtn.onclick = () => goToIndex(currentIndex + 1);
  }

  // "Read more" expand/collapse per card (event delegation)
  track.addEventListener("click", (e) => {
    const btn = e.target.closest(".testi-read-more");
    if (!btn) return;
    const text = btn.previousElementSibling;
    text.classList.toggle("line-clamp-4");
    btn.textContent = text.classList.contains("line-clamp-4") ? "Read more" : "Read less";
  });

  // ---- Fetch + render --------------------------------------------------
  async function loadTestimonials() {
    track.innerHTML = `<p class="text-sm text-slate-400 px-2">Loading reviews...</p>`;

    try {
      const res = await fetch(TESTIMONIALS_LIST_URL);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const json = await res.json();
      const testimonials = json.data || [];

      if (!testimonials.length) {
        track.innerHTML = `<p class="text-sm text-slate-400 px-2">No reviews yet.</p>`;
        return;
      }

      track.innerHTML = testimonials.map(cardHtml).join("");
      initCarouselControls();
    } catch (err) {
      console.error("Failed to load testimonials:", err);
      track.innerHTML = `<p class="text-sm text-red-400 px-2">Couldn't load reviews right now. Please try again later.</p>`;
    }
  }

  document.addEventListener("DOMContentLoaded", loadTestimonials);
  window.addEventListener("resize", () => {
    const cards = track.querySelectorAll(".testi-card");
    if (cards.length) buildDots(cards.length);
  });
})();