// ============================================================
//  js/site-settings.js
//
//  Fetches the admin-editable Settings (phone / whatsapp / email / logo)
//  from the backend and applies them EVERYWHERE on the current page —
//  every tel: link, mailto: link, wa.me WhatsApp link, and the site
//  logo — without needing to hand-edit every HTML file.
//
//  Include this script (after js/footer.js and js/navbar.js) on any
//  customer-facing page that shows contact info. If the API isn't
//  reachable yet, the page silently keeps whatever is already
//  hardcoded in its HTML — nothing breaks.
//
//  To make the site logo swappable too, give its <img> the id
//  "site-logo-img" (already done in js/navbar.js).
// ============================================================

(function () {
    const NICY_API_BASE = 'https://nicyfoods.srujaninfotech.com';

    const DEFAULTS = {
        phone: '+91 8263001410',
        whatsapp: '918263001410',
        email: 'nicyfoods5@gmail.com',
        logo: '',
    };

    function resolveLogoUrl(logo) {
        if (!logo) return null;
        if (logo.startsWith('http://') || logo.startsWith('https://')) return logo;
        return `${NICY_API_BASE}/uploads/site/${logo}`;
    }

    function applySettings(settings) {
        const phoneDigits = (settings.whatsapp || settings.phone || '').replace(/[^\d]/g, '');

        // ---- tel: links ----
        document.querySelectorAll('a[href^="tel:"]').forEach((a) => {
            a.setAttribute('href', `tel:+${phoneDigits}`);
            if (/\+?\d[\d\s]{7,}\d/.test(a.textContent)) {
                a.textContent = a.textContent.replace(/\+?\d[\d\s]{7,}\d/, settings.phone);
            }
        });

        // ---- mailto: links (preserve any ?subject=...&body=... query string) ----
        document.querySelectorAll('a[href^="mailto:"]').forEach((a) => {
            const href = a.getAttribute('href');
            const qIndex = href.indexOf('?');
            const query = qIndex >= 0 ? href.slice(qIndex) : '';
            a.setAttribute('href', `mailto:${settings.email}${query}`);
            if (a.textContent.includes('@')) {
                a.textContent = a.textContent.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/, settings.email);
            }
        });

        // ---- wa.me WhatsApp links ----
        document.querySelectorAll('a[href*="wa.me/"]').forEach((a) => {
            const href = a.getAttribute('href');
            a.setAttribute('href', href.replace(/wa\.me\/\d+/, `wa.me/${phoneDigits}`));
        });

        // ---- plain-text phone/email shown outside links (e.g. footer spans) ----
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) textNodes.push(node);
        textNodes.forEach((n) => {
            if (/\+?91[\s]?\d{10}/.test(n.nodeValue)) {
                n.nodeValue = n.nodeValue.replace(/\+?91[\s]?\d{10}/, settings.phone);
            }
            if (/[\w.+-]+@[\w-]+\.[\w.-]+/.test(n.nodeValue) && n.nodeValue.includes('nicyfoods5@gmail.com')) {
                n.nodeValue = n.nodeValue.replace('nicyfoods5@gmail.com', settings.email);
            }
        });

        // ---- site logo ----
        const logoUrl = resolveLogoUrl(settings.logo);
        if (logoUrl) {
            document.querySelectorAll('#site-logo-img, .site-logo-img').forEach((img) => {
                img.src = logoUrl;
            });
        }

        // Expose for any inline scripts on the page that build their own
        // WhatsApp/tel/mailto links dynamically (product cards etc.)
        window.NICY_SETTINGS = settings;
        window.dispatchEvent(new CustomEvent('nicy:settings-loaded', { detail: settings }));
    }

    function loadAndApply() {
        fetch(`${NICY_API_BASE}/api/settings`)
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
            .then((data) => applySettings({ ...DEFAULTS, ...data }))
            .catch(() => {
                // API not reachable — leave the page's hardcoded defaults as-is,
                // but still expose them so late-rendering scripts have something.
                window.NICY_SETTINGS = { ...DEFAULTS };
            });
    }

    // Re-apply whenever new nodes are added (e.g. product cards rendered
    // asynchronously after this script's initial fetch resolves).
    function observeLateContent() {
        const mo = new MutationObserver(() => {
            if (window.NICY_SETTINGS) applySettings(window.NICY_SETTINGS);
        });
        mo.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadAndApply();
            observeLateContent();
        });
    } else {
        loadAndApply();
        observeLateContent();
    }
})();
