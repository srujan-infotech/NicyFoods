// ============================================================================
// WELCOME DISCOUNT POPUP — shown to new site visitors to attract first orders.
//
// Reuses the exact same "Featured" coupon that already powers the banner on
// cart.html — one coupon, managed once by the admin (coupons.html), shows up
// everywhere: homepage popup, cart-page banner, and the checkout Apply-Now
// banner. No separate setup needed; whatever coupon the admin marks
// isActive + isFeatured is what this popup advertises.
//
// Shown once per visitor (tracked in localStorage) — closing it or copying
// the code marks it "seen" so it doesn't nag returning visitors. If no
// coupon is currently featured/active (or the spots have run out), nothing
// is shown at all.
//
// Include this on customer-facing pages via:
//   <script src="js/welcome-discount-popup.js"></script>
// (after navbar.js is fine — order doesn't matter, this is self-contained.)
// ============================================================================
(function () {
    var API_BASE = "https://nicyfoods.com";
    var STATS_URL = API_BASE + "/api/orders/customer-discount/stats";
    var SEEN_KEY = "nicyWelcomePopupSeen";
    var SHOW_DELAY_MS = 3500;

    // Don't show it again once the visitor has closed it or copied the code.
    function hasSeenPopup() {
        try {
            return localStorage.getItem(SEEN_KEY) === "1";
        } catch (e) {
            return false;
        }
    }
    function markSeen() {
        try {
            localStorage.setItem(SEEN_KEY, "1");
        } catch (e) {
            /* ignore (private-browsing etc.) */
        }
    }

    function injectStyles() {
        var style = document.createElement("style");
        style.textContent =
            ".wdp-overlay{position:fixed;inset:0;background:rgba(58,36,23,.55);z-index:9999;" +
            "display:flex;align-items:center;justify-content:center;padding:1rem;" +
            "opacity:0;transition:opacity .25s ease;}" +
            ".wdp-overlay.wdp-open{opacity:1;}" +
            ".wdp-card{position:relative;max-width:380px;width:100%;background:var(--cream,#fff);" +
            "border-radius:1.1rem;padding:2rem 1.6rem 1.7rem;text-align:center;" +
            "box-shadow:0 20px 50px rgba(0,0,0,.25);transform:translateY(14px) scale(.97);" +
            "transition:transform .25s ease;font-family:'Poppins',sans-serif;}" +
            ".wdp-overlay.wdp-open .wdp-card{transform:translateY(0) scale(1);}" +
            ".wdp-close{position:absolute;top:.7rem;right:.9rem;background:none;border:none;" +
            "font-size:1.3rem;line-height:1;color:#9a8a7c;cursor:pointer;padding:.2rem;}" +
            ".wdp-close:hover{color:var(--kumkum,#D7263D);}" +
            ".wdp-icon{font-size:2.4rem;color:var(--turmeric,#F5A623);margin-bottom:.6rem;}" +
            ".wdp-title{font-family:'Rozha One',serif;font-size:1.3rem;color:var(--jaggery,#5C3A25);" +
            "margin:0 0 .35rem;}" +
            ".wdp-sub{font-size:.85rem;color:#6b5a4d;margin:0 0 .3rem;}" +
            ".wdp-spots{font-size:.74rem;color:var(--herbal,#5F7A4F);font-weight:700;margin:0 0 1.1rem;}" +
            ".wdp-code-row{display:flex;align-items:center;justify-content:center;gap:.5rem;margin-bottom:1.1rem;}" +
            ".wdp-code-chip{font-family:'Courier New',monospace;font-weight:800;letter-spacing:.05em;" +
            "background:#fff;border:1.5px dashed var(--herbal,#5F7A4F);color:var(--jaggery,#5C3A25);" +
            "padding:.35rem .8rem;border-radius:.5rem;font-size:.92rem;}" +
            ".wdp-copy-btn{font-size:.76rem;font-weight:700;color:var(--herbal,#5F7A4F);" +
            "background:rgba(95,122,79,.12);border:none;border-radius:.5rem;padding:.4rem .7rem;cursor:pointer;}" +
            ".wdp-copy-btn:hover{background:rgba(95,122,79,.2);}" +
            ".wdp-shop-btn{display:inline-block;width:100%;background:linear-gradient(135deg,var(--turmeric,#F5A623),var(--kumkum,#D7263D));" +
            "color:#fff;font-weight:700;font-size:.9rem;padding:.75rem 1rem;border-radius:.7rem;" +
            "text-decoration:none;border:none;cursor:pointer;}" +
            ".wdp-shop-btn:hover{opacity:.92;}" +
            "@media (max-width:420px){.wdp-card{padding:1.6rem 1.2rem 1.4rem;}}";
        document.head.appendChild(style);
    }

    function buildPopup(data) {
        var offerLabel =
            data.discountType === "flat"
                ? "\u20B9" + data.discountValue + " OFF"
                : (data.discountValue || data.percent) + "% OFF";

        var overlay = document.createElement("div");
        overlay.className = "wdp-overlay";
        overlay.innerHTML =
            '<div class="wdp-card" role="dialog" aria-label="Welcome offer">' +
            '<button type="button" class="wdp-close" aria-label="Close">&times;</button>' +
            '<div class="wdp-icon"><i class="fas fa-gift"></i></div>' +
            '<h3 class="wdp-title">Welcome to NicyFoods!</h3>' +
            '<p class="wdp-sub">Get <strong>' + offerLabel + '</strong> on your first order</p>' +
            (data.limit
                ? '<p class="wdp-spots">' + data.remaining + " of " + data.limit + " spots left</p>"
                : "") +
            '<div class="wdp-code-row">' +
            '<span class="wdp-code-chip">' + data.code + "</span>" +
            '<button type="button" class="wdp-copy-btn">Copy Code</button>' +
            "</div>" +
            '<a href="product.html" class="wdp-shop-btn">Start Shopping</a>' +
            "</div>";
        return overlay;
    }

    function showPopup(overlay) {
        document.body.appendChild(overlay);
        // Force layout so the transition actually runs, then open.
        requestAnimationFrame(function () {
            overlay.classList.add("wdp-open");
        });

        function close() {
            markSeen();
            overlay.classList.remove("wdp-open");
            setTimeout(function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }, 250);
        }

        overlay.querySelector(".wdp-close").addEventListener("click", close);
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) close();
        });
        overlay.querySelector(".wdp-copy-btn").addEventListener("click", function (e) {
            var btn = e.currentTarget;
            var code = overlay.querySelector(".wdp-code-chip").textContent;
            function done() {
                btn.textContent = "Copied!";
                markSeen();
                setTimeout(close, 900);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(done).catch(done);
            } else {
                done();
            }
        });
        // "Start Shopping" also counts as seen — they've engaged with the offer.
        overlay.querySelector(".wdp-shop-btn").addEventListener("click", markSeen);
    }

    async function init() {
        if (hasSeenPopup()) return;
        try {
            var res = await fetch(STATS_URL);
            var json = await res.json();
            var data = json && json.data;
            if (!data || !data.active || !data.code) return;

            injectStyles();
            var overlay = buildPopup(data);
            setTimeout(function () {
                showPopup(overlay);
            }, SHOW_DELAY_MS);
        } catch (err) {
            console.warn("Welcome discount popup: could not load offer stats:", err);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
