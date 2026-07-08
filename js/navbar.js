// navbar.js - Shared navbar with RBAC (JWT authentication)
// Uses cached user data from localStorage; retries if data is missing.

function loadNavbar() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  const navHTML = `
    <div id="site-navbar" class="fixed top-0 left-0 w-full z-[9999]">
      <nav id="nav-bar-inner" class="bg-jaggery flex items-center justify-between gap-4 px-6 md:px-10 py-4 transition-shadow duration-300" style="font-family:'Poppins', sans-serif;">

        <!-- Logo -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <a href="index.html" class="flex items-center gap-3 group">
            <img src="https://nicyfoods.com/images/logo.png" alt="NicyFoods Logo" class="w-11 h-11 rounded-md object-cover ring-2 ring-marigold/30 transition-transform duration-300 group-hover:scale-105">
            <span class="text-cream text-2xl" style="font-family:'Rozha One', serif;">NicyFoods</span>
          </a>
        </div>

        <!-- Desktop Menu -->
        <ul class="hidden md:flex items-center gap-8 text-cream font-semibold text-base flex-1 justify-center">
          <li><a href="index.html" data-page="index.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">Home</a></li>
          <li><a href="products.html" data-page="products.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">Products</a></li>
          <li><a href="about.html" data-page="about.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">About Us</a></li>
          <li><a href="contact.html" data-page="contact.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">Contact</a></li>
          <li><a href="faq.html" data-page="faq.html" class="nav-link relative pb-1 hover:text-marigold transition-colors">FAQ's</a></li>
        </ul>

        <!-- Right icons -->
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

          <!-- Account / User Dropdown -->
          <div id="account-container" class="relative">
            <button id="account-btn" aria-label="Account" class="nav-icon-btn text-cream hover:text-marigold transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span id="account-username" class="text-sm font-medium hidden md:inline"></span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 hidden md:inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            <!-- Dropdown menu -->
            <div id="account-dropdown" class="nav-dropdown-collapsed absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg min-w-[180px] overflow-hidden">
              <div id="account-dropdown-content"></div>
            </div>
          </div>

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

          <!-- Mobile menu toggle -->
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
        <li><a href="faq.html" data-page="faq.html" class="nav-link-mobile block py-3 hover:text-marigold hover:pl-2 transition-all">FAQ's</a></li>
        <div id="mobile-rbac-links"></div>
      </ul>
    </div>

    <!-- Spacer -->
    <div id="navbar-spacer" style="display:none;"></div>

    <style>
      #site-navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
        background-color: #5C3A25;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
      }
      #site-navbar #nav-bar-inner {
        background-color: #5C3A25;
        transition: box-shadow 0.3s ease;
      }
      #site-navbar #nav-bar-inner.nav-scrolled {
        box-shadow: 0 8px 28px -6px rgba(0, 0, 0, 0.5);
      }
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
      #site-navbar .nav-link.nav-active,
      #site-navbar .nav-link-mobile.nav-active {
        color: #F2C14E;
      }
      #site-navbar #mobile-menu {
        max-height: 0;
        transition: max-height 0.4s cubic-bezier(0.16, 0.84, 0.44, 1), padding 0.4s ease;
        padding-top: 0;
        padding-bottom: 0;
        overflow: hidden;
        background-color: #5C3A25;
      }
      #site-navbar #mobile-menu.mobile-menu-open {
        max-height: 500px;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
      #site-navbar .nav-icon-btn {
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
      }
      #site-navbar .nav-icon-btn:hover {
        transform: translateY(-2px);
      }
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
      #site-navbar .nav-search-collapsed {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 0.84, 0.44, 1);
      }
      #site-navbar .nav-search-collapsed.nav-search-open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      #account-dropdown {
        opacity: 0;
        transform: translateY(-8px) scale(0.98);
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      #account-dropdown.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      #account-dropdown a,
      #account-dropdown button {
        display: block;
        padding: 0.6rem 1.2rem;
        color: #3A2417;
        font-weight: 500;
        text-decoration: none;
        transition: background 0.2s ease, color 0.2s ease;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        font-size: 0.9rem;
        cursor: pointer;
      }
      #account-dropdown a:hover,
      #account-dropdown button:hover {
        background: rgba(166,58,46,0.08);
        color: #A63A2E;
      }
      #account-dropdown .dropdown-divider {
        border-top: 1px solid rgba(92,58,37,0.1);
        margin: 0.2rem 0;
      }
      #account-username {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      @media (prefers-reduced-motion: reduce) {
        #site-navbar * { transition: none !important; }
      }
    </style>
  `;

  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return console.warn("navbar.js: #navbar-placeholder missing");
  placeholder.innerHTML = navHTML;

  // ── Spacer ──
  const spacer = document.getElementById("navbar-spacer");
  if (spacer) {
    const navbar = document.getElementById("site-navbar");
    if (navbar) {
      const height = navbar.offsetHeight;
      spacer.style.display = "block";
      spacer.style.height = height + "px";
      spacer.style.width = "100%";
      spacer.style.flexShrink = "0";
      window.addEventListener("resize", () => {
        spacer.style.height = navbar.offsetHeight + "px";
      });
    }
  }

  // ── Refs ──
  const navInner = document.getElementById("nav-bar-inner");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuBtn = document.getElementById("menu-btn");
  const iconOpen = document.getElementById("menu-icon-open");
  const iconClose = document.getElementById("menu-icon-close");
  const searchBtn = document.getElementById("search-btn");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const accountBtn = document.getElementById("account-btn");
  const accountDropdown = document.getElementById("account-dropdown");
  const accountUsername = document.getElementById("account-username");
  const dropdownContent = document.getElementById("account-dropdown-content");
  const mobileRbacLinks = document.getElementById("mobile-rbac-links");

  // ── Highlight current page ──
  document.querySelectorAll(".nav-link, .nav-link-mobile").forEach(link => {
    if (link.getAttribute("data-page") === currentPage) link.classList.add("nav-active");
  });

  // ── Scroll shadow ──
  window.addEventListener("scroll", () => {
    navInner.classList.toggle("nav-scrolled", window.scrollY > 10);
  }, { passive: true });

  // ── Mobile menu toggle ──
  if (menuBtn && mobileMenu && iconOpen && iconClose) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("mobile-menu-open");
      iconOpen.classList.toggle("hidden", isOpen);
      iconClose.classList.toggle("hidden", !isOpen);
    });
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("mobile-menu-open");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
      });
    });
  }

  // ── Search toggle ──
  if (searchBtn && searchForm && searchInput) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = searchForm.classList.toggle("nav-search-open");
      if (isOpen) searchInput.focus();
    });
    document.addEventListener("click", (e) => {
      if (!searchForm.contains(e.target) && !searchBtn.contains(e.target)) {
        searchForm.classList.remove("nav-search-open");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchForm.classList.remove("nav-search-open");
        searchInput.blur();
      }
    });
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      window.location.href = q ? `products.html?search=${encodeURIComponent(q)}` : "products.html";
    });
  }

  // ── Account dropdown toggle ──
  if (accountBtn && accountDropdown) {
    accountBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      accountDropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => {
      accountDropdown.classList.remove("open");
    });
  }

  // ── Badge counts (cart / wishlist) ──
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
    renderBadge(document.getElementById("wishlist-badge"), readCount("nicy_wishlist_count"));
    renderBadge(document.getElementById("cart-badge"), readCount("nicy_cart_count"));
  }
  refreshBadges();
  window.addEventListener("storage", refreshBadges);
  window.addEventListener("nicy:counts-updated", refreshBadges);

  // ── RBAC – Authentication and Role Management ──
  const TOKEN_KEY = "admin_token";

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function getUser() {
    try {
      const raw = localStorage.getItem("admin_user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function updateNavbarUI(user) {
    const isLoggedIn = !!user;
    const isAdmin = isLoggedIn && user.role === "admin";

    // Dropdown content
    let html = "";
    if (isLoggedIn) {
      html = `
        <div class="px-4 py-2 text-sm font-semibold text-jaggery border-b border-jaggery/10">
          ${user.name}
          <span class="block text-xs font-normal text-slate-400">${user.email}</span>
        </div>
        ${isAdmin ? `<a href="admin.html"> Admin Dashboard</a>` : ""}
        <div class="dropdown-divider"></div>
        <button id="logout-btn"> Logout</button>
      `;
    } else {
      html = `
        <a href="login.html">Login</a>
        
      `;
    }
    dropdownContent.innerHTML = html;

    // Username
    accountUsername.textContent = isLoggedIn ? user.name : "";
    accountUsername.classList.toggle("hidden", !isLoggedIn);

    // Mobile RBAC links
    let mobileHtml = "";
    if (isAdmin) {
      mobileHtml += `<li><a href="admin.html" class="block py-3 border-b border-cream/10 hover:text-marigold hover:pl-2 transition-all">⚙️ Admin</a></li>`;
    }
    if (isLoggedIn) {
      mobileHtml += `<li><button id="mobile-logout-btn" class="block w-full text-left py-3 hover:text-marigold hover:pl-2 transition-all">🚪 Logout</button></li>`;
    } else {
      mobileHtml += `
        <li><a href="login.html" class="block py-3 border-b border-cream/10 hover:text-marigold hover:pl-2 transition-all">🔑 Login</a></li>
        <li><a href="register.html" class="block py-3 hover:text-marigold hover:pl-2 transition-all">📝 Register</a></li>
      `;
    }
    if (mobileRbacLinks) mobileRbacLinks.innerHTML = mobileHtml;

    // Attach logout listeners
    document.getElementById("logout-btn")?.addEventListener("click", handleLogout);
    document.getElementById("mobile-logout-btn")?.addEventListener("click", handleLogout);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("admin_user");
    window.location.reload();
  }

  function initRbac() {
    const token = getToken();
    if (!token) {
      updateNavbarUI(null);
      return;
    }
    const user = getUser();
    if (user) {
      if (!user.role) {
        console.warn(" user.role is missing. Assuming non-admin.");
        user.role = 'user';
      }
      updateNavbarUI(user);
    } else {
      // Token exists but user data missing – retry after short delay
      console.log(" User data not found. Retrying in 300ms...");
      setTimeout(() => {
        const retryUser = getUser();
        if (retryUser) {
          updateNavbarUI(retryUser);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          updateNavbarUI(null);
        }
      }, 300);
    }
  }

  // Init after DOM ready
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initRbac();
  } else {
    document.addEventListener("DOMContentLoaded", initRbac);
  }

  // Re-init on storage changes (e.g., login in another tab)
  window.addEventListener("storage", (e) => {
    if (e.key === TOKEN_KEY || e.key === "admin_user") {
      initRbac();
    }
  });

  // Custom event to force an update
  window.addEventListener("force-navbar-update", initRbac);
}

// ── Load ──
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadNavbar);
} else {
  loadNavbar();
}