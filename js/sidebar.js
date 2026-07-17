// ============================================================
//  NicyFoods Admin — Reusable Sidebar
//  Renders the sidebar + hamburger + overlay into the page,
//  highlights the active nav item based on <body data-page="...">,
//  and loads live badge counts.
//
//  Requires: admin-common.js (apiFetch, safeJson, requireAdmin)
//  Include AFTER admin-common.js.
// ============================================================

const NAV_ITEMS = [
    { key: 'dashboard',        label: 'Dashboard',         icon: 'fa-chart-pie',        href: 'dashboard.html',        badgeId: 'navProductCount_UNUSED', showBadge: false },
    { key: 'products',         label: 'Products',          icon: 'fa-box',               href: 'products.html',         badgeId: 'navProductCount',      showBadge: true },
    { key: 'testimonials',     label: 'Testimonials',      icon: 'fa-star',              href: 'testimonials.html',     badgeId: 'navTestimonialCount',  showBadge: true },
    { key: 'orders',           label: 'Orders',            icon: 'fa-shopping-cart',     href: 'orders.html',           badgeId: 'navOrderCount',        showBadge: true },
    { key: 'contacts',         label: 'Messages',          icon: 'fa-envelope',          href: 'contacts.html',         badgeId: 'navContactCount',      showBadge: true },
    { key: 'hero',             label: 'Hero',               icon: 'fa-image',             href: 'hero.html',             badgeId: 'navHeroCount',         showBadge: true },
    { key: 'companies',        label: 'Companies',         icon: 'fa-building',          href: 'companies.html',        badgeId: 'navCompanyCount',      showBadge: true },
    { key: 'story',            label: 'Our Story',         icon: 'fa-book-open',         href: 'story.html',            badgeId: 'navStoryCount',        showBadge: true },
    { key: 'coreValues',       label: 'Core Values',       icon: 'fa-gem',               href: 'core-values.html',      badgeId: 'navCoreValueCount',    showBadge: true },
    { key: 'qualityPromises',  label: 'Quality Promises',  icon: 'fa-shield-alt',        href: 'quality-promises.html', badgeId: 'navQualityPromiseCount', showBadge: true },
    { key: 'whyChooseUs',      label: 'Why Choose Us',     icon: 'fa-question-circle',   href: 'why-choose-us.html',    badgeId: 'navWhyChooseUsCount',  showBadge: true },
    { key: 'missionVision',    label: 'Mission & Vision',  icon: 'fa-bullseye',          href: 'mission-vision.html',   badgeId: 'navMissionVisionCount', showBadge: true, staticCount: 1 },
];

const PAGE_TITLES = {
    dashboard: { title: 'Dashboard', icon: 'fa-chart-pie' },
    products: { title: 'Products', icon: 'fa-box' },
    testimonials: { title: 'Testimonials', icon: 'fa-star' },
    orders: { title: 'Orders', icon: 'fa-shopping-cart' },
    contacts: { title: 'Messages', icon: 'fa-envelope' },
    hero: { title: 'Hero Section', icon: 'fa-image' },
    companies: { title: 'Companies', icon: 'fa-building' },
    story: { title: 'Our Story', icon: 'fa-book-open' },
    coreValues: { title: 'Core Values', icon: 'fa-gem' },
    qualityPromises: { title: 'Quality Promises', icon: 'fa-shield-alt' },
    whyChooseUs: { title: 'Why Choose Us', icon: 'fa-question-circle' },
    missionVision: { title: 'Mission & Vision', icon: 'fa-bullseye' },
};

function renderSidebar(activePage) {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    const navHtml = NAV_ITEMS.map(item => `
        <a class="nav-item ${item.key === activePage ? 'active' : ''}" href="${item.href}">
            <span class="icon"><i class="fas ${item.icon}"></i></span> ${item.label}
            ${item.showBadge ? `<span class="badge" id="${item.badgeId}">0</span>` : ''}
        </a>
    `).join('');

    container.innerHTML = `
        <div id="sidebarOverlay"></div>
        <aside id="sidebar">
            <div class="brand">
                <h1><i class="fas fa-leaf"></i>NicyFoods</h1>
                <span>Administration</span>
            </div>
            <nav style="flex:1; padding: 0.4rem 0;">
                ${navHtml}
            </nav>
            <div class="sidebar-footer">
                <div class="user">
                    <div class="avatar" id="sidebarAvatar">A</div>
                    <div>
                        <div class="name" id="sidebarName">Admin</div>
                        <div class="role"><i class="fas fa-shield-alt"></i> Administrator</div>
                    </div>
                </div>
                <button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
            </div>
        </aside>
    `;

    // Wire up logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        AUTH.logout();
        window.location.href = 'index.html';
    });

    // Wire up overlay -> close sidebar on mobile
    document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);
}

function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebarOverlay');
    if (!sb || !ov) return;
    sb.classList.toggle('open');
    ov.classList.toggle('open');
}

function renderTopbar(activePage) {
    const topbar = document.getElementById('topbar-container');
    if (!topbar) return;
    const info = PAGE_TITLES[activePage] || { title: 'Dashboard', icon: 'fa-chart-pie' };
    topbar.innerHTML = `
        <button id="hamburger" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
        <div style="flex:1; min-width:0;">
            <h1 class="font-display text-2xl md:text-3xl text-jaggery" id="pageTitle">
                <i class="fas ${info.icon} text-kumkum" style="margin-right:0.6rem;"></i>${info.title}
            </h1>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem;">
            <span class="text-sm text-slate-500 hidden sm:inline" id="adminUserLabel"></span>
        </div>
    `;
}

function populateSidebarUser(user) {
    if (!user) return;
    const label = document.getElementById('adminUserLabel');
    if (label) label.textContent = user.name || user.email || '';
    const nameEl = document.getElementById('sidebarName');
    if (nameEl) nameEl.textContent = user.name || 'Admin';
    const avatar = document.getElementById('sidebarAvatar');
    if (avatar) avatar.textContent = (user.name || 'A')[0].toUpperCase();
}

// ============================================================
//  NAV BADGE COUNTS
//  Loads counts for all sections so every page shows an
//  up-to-date sidebar, regardless of which page is open.
// ============================================================
async function loadNavCounts() {
    const fetchCount = async (path, unwrap = false) => {
        try {
            const res = await apiFetch(path);
            if (!res.ok) return 0;
            const json = await safeJson(res);
            const data = unwrap ? (json.data || json) : json;
            return Array.isArray(data) ? data.length : 0;
        } catch (e) {
            return 0;
        }
    };

    const setBadge = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    // Fixed-count sections (single-record content blocks)
    setBadge('navHeroCount', 1);
    setBadge('navStoryCount', 1);
    setBadge('navMissionVisionCount', 1);

    const [products, testimonials, orders, contacts, companies, coreValues, qualityPromises, whyChooseUs] =
        await Promise.all([
            fetchCount('/api/products'),
            fetchCount('/api/testimonials'),
            fetchCount('/api/orders'),
            fetchCount('/api/contact'),
            fetchCount('/api/companies', true),
            fetchCount('/api/core-values', true),
            fetchCount('/api/quality-promise', true),
            fetchCount('/api/why-choose-us', true),
        ]);

    setBadge('navProductCount', products);
    setBadge('navTestimonialCount', testimonials);
    setBadge('navOrderCount', orders);
    setBadge('navContactCount', contacts);
    setBadge('navCompanyCount', companies);
    setBadge('navCoreValueCount', coreValues);
    setBadge('navQualityPromiseCount', qualityPromises);
    setBadge('navWhyChooseUsCount', whyChooseUs);
}

// ============================================================
//  INIT — called by every page on load
// ============================================================
function initAdminShell(activePage) {
    const user = requireAdmin();
    if (!user) return null; // redirected

    renderSidebar(activePage);
    renderTopbar(activePage);
    populateSidebarUser(user);
    initModalOverlayClickToClose();
    loadNavCounts();

    return user;
}

window.toggleSidebar = toggleSidebar;
window.initAdminShell = initAdminShell;
window.loadNavCounts = loadNavCounts;
