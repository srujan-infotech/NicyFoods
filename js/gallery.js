// ============================================================
// Public "A Glimpse Of Our Ladoos" gallery loader
// Fetches admin-uploaded images from the backend and swaps them
// into the gallery grid. If the API is unavailable or returns no
// images, the static markup already in index.html is left as-is
// so the section never breaks.
// ============================================================

const GALLERY_API_BASE_URL = "https://nicyfoods.com";
const GALLERY_API_URL = `${GALLERY_API_BASE_URL}/api/gallery`;

function galleryTileHtml(item) {
  const isLarge = item.size === "large";
  const sizeClasses = isLarge
    ? "row-span-2 h-full min-h-[17rem] md:min-h-[22rem]"
    : "h-40 md:h-52";
  const alt = (item.alt || item.title || "NicyFoods Ladoo").replace(/"/g, "&quot;");

  return `
    <div class="gallery-tile rounded-2xl overflow-hidden shadow-sm ${sizeClasses}">
        <img src="${item.image}" alt="${alt}" loading="lazy" class="w-full h-full object-cover">
    </div>
  `;
}

async function loadLadooGallery() {
  const grid = document.getElementById("ladooGalleryGrid");
  if (!grid) return;

  try {
    const res = await fetch(GALLERY_API_URL);
    if (!res.ok) return; // keep the static fallback tiles already in the HTML

    const json = await res.json().catch(() => null);
    const items = Array.isArray(json) ? json : json?.data;

    if (!Array.isArray(items) || items.length === 0) return;

    grid.innerHTML = items.map(galleryTileHtml).join("");
  } catch (err) {
    // Network error / API offline — silently keep the static fallback gallery
    console.warn("Gallery: using fallback images —", err.message);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadLadooGallery);
} else {
  loadLadooGallery();
}
