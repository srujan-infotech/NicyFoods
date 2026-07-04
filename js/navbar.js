// navbar.js - shared navbar component, loaded on every page
// Uses position: fixed for reliable stick-to-top behavior across all browsers.
// A spacer div is added automatically to prevent content from hiding behind the navbar.

function loadNavbar() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const navHTML = `
    <!-- 
      position: fixed + top: 0 ensures the navbar stays at the top always.
      A spacer div is added to prevent content from hiding behind the fixed navbar.
    -->
    <div id="site-navbar" class="fixed top-0 left-0 w-full z-[9999]">
      <nav id="nav-bar-inner" class="bg-jaggery flex items-center justify-between gap-4 px-6 md:px-10 py-4 transition-shadow duration-300" style="font-family:'Poppins', sans-serif;">

        <div class="flex items-center gap-3 flex-shrink-0">
          <a href="index.html" class="flex items-center gap-3 group">
            <img src="https://nicyfoods.com/images/logo.png" alt="NicyFoods Logo" class="w-11 h-11 rounded-md object-cover ring-2 ring-marigold/30 transition-transform duration-300 group-hover:scale-105">
            <span class="text-cream text-2xl" style="font-family:'Rozha One', serif;">NicyFoods</span>
          </a>
        </div>

        <ul class="hidden md:flex items-center gap-8 text-cream font-semibold text-base flex-1 justify-center">
          <li><a href="index.html" data-page="index.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">Home</a></li>
          <li><a href="products.html" data-page="products.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">Products</a></li>
          <li><a href="about.html" data-page="about.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">About Us</a></li>
          <li><a href="contact.html" data-page="contact.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">Contact</a></li>
          <li><a href="contact.html#faq" data-page="faq.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">FAQ's</a></li>
        </ul>

        <div class="flex items-center gap-4 md:gap-5 flex-shrink-0">

          <!-- Search -->
          <div class="relative">
            <button id="search-btn" aria-label="Search" class="nav-icon-btn text-cream hover:text-marigold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
              </svg>
            </button>
            <form id="search-form" class="nav-search-collapsed absolute right-0 top-full mt-3 bg-white rounded-xl shadow-lg overflow-hidden flex">
              <input id="search-input" type="text" placeholder="Search ladoos..." class="px-4 py-2.5 text-sm text-jaggery w-56 focus:outline-none" />
              <button type="submit" aria-label="Submit search" class="bg-turmeric text-white px-3 flex items-center justify-center hover:bg-kumkum transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
                </svg>
              </button>
            </form>
          </div>

          <!-- Account -->
          <a href="contact.html" aria-label="Account" class="nav-icon-btn text-cream hover:text-marigold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </a>

          <!-- Wishlist -->
          <a href="wishlist.html" id="wishlist-link" aria-label="Wishlist" class="nav-icon-btn relative text-cream hover:text-marigold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
            </svg>
            <span id="wishlist-badge" class="nav-badge hidden">0</span>
          </a>

          <!-- Cart -->
          <a href="cart.html" id="cart-link" aria-label="Cart" class="nav-icon-btn relative text-cream hover:text-marigold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.6 13.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L23 6H6"/>
            </svg>
            <span id="cart-badge" class="nav-badge hidden">0</span>
          </a>

          <button id="menu-btn" class="md:hidden text-cream focus:outline-none">
            <svg id="menu-icon-open" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg id="menu-icon-close" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>

      <!-- Mobile menu -->
      <ul id="mobile-menu" class="mobile-menu-collapsed md:hidden bg-jaggery text-cream font-semibold text-lg flex flex-col gap-1 px-6 overflow-hidden" style="font-family:'Poppins', sans-serif;">
        <li><a href="index.html" data-page="index.html" class="nav-link-mobile block py-3 border-b border-cream/10 hover:text-marigold hover:pl-2 transition-all">Home</a></li>
        <li><a href="products.html" data-page="products.html" class="nav-link-mobile block py-3 border-b border-cream/10 hover:text-marigold hover:pl-2 transition-all">Products</a></li>
        <li><a href="about.html" data-page="about.html" class="nav-link-mobile block py-3 border-b border-cream/10 hover:text-marigold hover:pl-2 transition-all">About Us</a></li>
        <li><a href="contact.html" data-page="contact.html" class="nav-link-mobile block py-3 border-b border-cream/10 hover:text-marigold hover:pl-2 transition-all">Contact</a></li>
        <li><a href="contact.html#faq" data-page="faq.html" class="nav-link-mobile block py-3 hover:text-marigold hover:pl-2 transition-all">FAQ's</a></li>
      </ul>
    </div>

    <!-- Spacer to prevent content from hiding behind fixed navbar -->
    <div id="navbar-spacer" style="display:none;"></div>

    <style>
      /* ── fixed navbar ── */
      #site-navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
        background-color: #5C3A25;
        /* jaggery - solid background to prevent bleed-through */
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
      }

      /* The nav background is already #5C3A25 (jaggery) via Tailwind */
      #site-navbar #nav-bar-inner {
        background-color: #5C3A25;
        transition: box-shadow 0.3s ease;
      }

      /* When scrolled, enhance the shadow */
      #site-navbar #nav-bar-inner.nav-scrolled {
        box-shadow: 0 8px 28px -6px rgba(0, 0, 0, 0.5);
      }

      /* ── nav link underline ── */
      #site-navbar .nav-link::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -2px;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #E8A33D, #F2C14E);
        border-radius: 2px;
        transition: width 0.3s cubic-bezier(0.16, 0.84, 0.44, 1);
      }
      #site-navbar .nav-link:hover::after,
      #site-navbar .nav-link.nav-active::after {
        width: 100%;
      }
      #site-navbar .nav-link.nav-active {
        color: #F2C14E;
      }
      #site-navbar .nav-link-mobile.nav-active {
        color: #F2C14E;
      }

      /* ── mobile menu collapse ── */
      #site-navbar #mobile-menu {
        max-height: 0;
        transition: max-height 0.4s cubic-bezier(0.16, 0.84, 0.44, 1),
          padding 0.4s ease;
        padding-top: 0;
        padding-bottom: 0;
        overflow: hidden;
        background-color: #5C3A25;
      }
      #site-navbar #mobile-menu.mobile-menu-open {
        max-height: 400px;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }

      /* ── icon buttons ── */
      #site-navbar .nav-icon-btn {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
          color 0.3s ease;
      }
      #site-navbar .nav-icon-btn:hover {
        transform: translateY(-2px);
      }

      /* ── badges (cart / wishlist count) ── */
      #site-navbar .nav-badge {
        position: absolute;
        top: -7px;
        right: -9px;
        background: #F2C14E;
        color: #3A2417;
        font-size: 10px;
        font-weight: 700;
        min-width: 16px;
        height: 16px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 3px;
        line-height: 1;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }

      /* ── search dropdown ── */
      #site-navbar .nav-search-collapsed {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
        pointer-events: none;
        transition: opacity 0.25s ease,
          transform 0.25s cubic-bezier(0.16, 0.84, 0.44, 1);
      }
      #site-navbar .nav-search-collapsed.nav-search-open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      /* ── reduced motion ── */
      @media (prefers-reduced-motion: reduce) {
        #site-navbar * {
          transition: none !important;
        }
      }
    </style>
  `;

  // ── inject navbar ──
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) {
    console.warn("navbar.js: #navbar-placeholder not found");
    return;
  }
  placeholder.innerHTML = navHTML;

  // ── add spacer after navbar to prevent content from hiding ──
  const spacer = document.getElementById("navbar-spacer");
  if (spacer) {
    // Get navbar height and set spacer
    const navbar = document.getElementById("site-navbar");
    if (navbar) {
      const height = navbar.offsetHeight;
      spacer.style.display = "block";
      spacer.style.height = height + "px";
      spacer.style.width = "100%";
      spacer.style.flexShrink = "0";
      
      // Recalculate on resize
      window.addEventListener("resize", () => {
        const newHeight = navbar.offsetHeight;
        spacer.style.height = newHeight + "px";
      });
    }
  }

  // ── refs ──
  const navInner = document.getElementById("nav-bar-inner");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuBtn = document.getElementById("menu-btn");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  const searchBtn = document.getElementById("search-btn");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  // ── highlight current page ──
  document.querySelectorAll(".nav-link, .nav-link-mobile").forEach((link) => {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("nav-active");
    }
  });

  // ── scroll shadow ──
  const handleScroll = () => {
    navInner.classList.toggle("nav-scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });

  // ── mobile menu toggle ──
  if (menuBtn && mobileMenu && iconOpen && iconClose) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("mobile-menu-open");
      iconOpen.classList.toggle("hidden", isOpen);
      iconClose.classList.toggle("hidden", !isOpen);
    });

    // close mobile menu when a link is clicked
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("mobile-menu-open");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
      });
    });
  }

  // ── search toggle ──
  if (searchBtn && searchForm && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = searchForm.classList.toggle("nav-search-open");
      if (isOpen) {
        searchInput.focus();
      }
    });

    // close search when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchForm.contains(e.target) && !searchBtn.contains(e.target)) {
        searchForm.classList.remove("nav-search-open");
      }
    });

    // close search on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchForm.classList.remove("nav-search-open");
        searchInput.blur();
      }
    });

    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      window.location.href = q
        ? `products.html?search=${encodeURIComponent(q)}`
        : "products.html";
    });
  }

  // ── cart / wishlist badge counts ──
  function readCount(key) {
    const n = parseInt(localStorage.getItem(key), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  function renderBadge(el, count) {
    if (!el) return;
    el.textContent = count > 99 ? "99+" : String(count);
    el.classList.toggle("hidden", count <= 0);
  }

  function refreshBadges() {
    renderBadge(
      document.getElementById("wishlist-badge"),
      readCount("nicy_wishlist_count")
    );
    renderBadge(
      document.getElementById("cart-badge"),
      readCount("nicy_cart_count")
    );
  }

  refreshBadges();
  window.addEventListener("storage", refreshBadges);
  window.addEventListener("nicy:counts-updated", refreshBadges);
}

// ── load when DOM is ready ──
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadNavbar);
} else {
  loadNavbar();
}