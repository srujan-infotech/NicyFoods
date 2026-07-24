// // ============================================================
// //  Dashboard page logic
// // ============================================================

// let categoryChartInstance = null;
// let ordersChartInstance = null;

// (function init() {
//     const user = initAdminShell('dashboard');
//     if (!user) return;
//     loadDashboard();
// })();

// async function loadDashboard() {
//     try {
//         const fetchAll = async (path) => {
//             try {
//                 const res = await apiFetch(path);
//                 if (!res.ok) {
//                     console.error(`HTTP ${res.status} from ${path}`);
//                     return [];
//                 }
//                 const data = await safeJson(res);

//                 // ✅ Ensure we always return an array
//                 if (Array.isArray(data)) {
//                     return data;
//                 } else if (data && typeof data === 'object') {
//                     // Handle common API response patterns
//                     if (Array.isArray(data.data)) return data.data;
//                     if (Array.isArray(data.orders)) return data.orders;
//                     if (Array.isArray(data.products)) return data.products;
//                     if (Array.isArray(data.items)) return data.items;
//                     if (Array.isArray(data.results)) return data.results;

//                     console.warn(`Unexpected response structure from ${path}:`, data);
//                     return [];
//                 }
//                 return [];
//             } catch (e) {
//                 console.error(`Error fetching ${path}:`, e);
//                 return [];
//             }
//         };

//         const [products, testimonials, orders, contacts, users] = await Promise.all([
//             fetchAll('/api/products'),
//             fetchAll('/api/testimonials'),
//             fetchAll('/api/orders'),
//             fetchAll('/api/contact'),
//             fetchAll('/api/auth/users'),
//         ]);

//         // ✅ Safety checks before using .length
//         document.getElementById('statProducts').textContent = Array.isArray(products) ? products.length : 0;
//         document.getElementById('statTestimonials').textContent = Array.isArray(testimonials) ? testimonials.length : 0;
//         document.getElementById('statOrders').textContent = Array.isArray(orders) ? orders.length : 0;
//         document.getElementById('statContacts').textContent = Array.isArray(contacts) ? contacts.length : 0;
//         document.getElementById('statUsers').textContent = Array.isArray(users) ? users.length : 0;

//         document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

//         // ✅ Always pass arrays
//         updateCategoryChart(Array.isArray(products) ? products : []);
//         updateOrdersChart(Array.isArray(orders) ? orders : []);
//         renderRecentOrders(Array.isArray(orders) ? orders : []);
//     } catch (e) {
//         showToast('Error loading dashboard: ' + e.message, true);
//         console.error(e);
//     }
// }

// function updateCategoryChart(products) {
//     const ctx = document.getElementById('categoryChart').getContext('2d');

//     if (!Array.isArray(products)) {
//         console.error('updateCategoryChart: products is not an array', products);
//         products = [];
//     }

//     const categories = {};
//     products.forEach(p => {
//         const cat = p.category || 'other';
//         categories[cat] = (categories[cat] || 0) + 1;
//     });

//     const labels = Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1));
//     const data = Object.values(categories);
//     const colors = ['#F5A623', '#D7263D', '#5F7A4F', '#3b82f6', '#8b5cf6', '#ec4899'];

//     if (categoryChartInstance) categoryChartInstance.destroy();

//     categoryChartInstance = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//             labels: labels.length ? labels : ['No Products'],
//             datasets: [{
//                 data: data.length ? data : [1],
//                 backgroundColor: colors.slice(0, Math.max(data.length, 1)),
//                 borderWidth: 3,
//                 borderColor: '#FFFFFF',
//                 hoverOffset: 8,
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     position: 'bottom',
//                     labels: {
//                         boxWidth: 12,
//                         padding: 12,
//                         font: { size: 11, family: 'Poppins' },
//                         color: '#3A2417'
//                     }
//                 }
//             },
//             cutout: '65%',
//         }
//     });
// }

// // ---------- Monthly Orders: now a LINE graph instead of bar ----------
// function updateOrdersChart(orders) {
//     const canvas = document.getElementById('ordersChart');
//     const ctx = canvas.getContext('2d');

//     if (!Array.isArray(orders)) {
//         console.error('updateOrdersChart: orders is not an array', orders);
//         orders = [];
//     }

//     const months = {};
//     const now = new Date();
//     for (let i = 5; i >= 0; i--) {
//         const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const key = d.toLocaleString('default', { month: 'short' });
//         months[key] = 0;
//     }

//     orders.forEach(o => {
//         try {
//             const d = new Date(o.createdAt);
//             const key = d.toLocaleString('default', { month: 'short' });
//             if (months[key] !== undefined) months[key] += 1;
//         } catch (e) {
//             console.warn('Error processing order date:', e, o);
//         }
//     });

//     const labels = Object.keys(months);
//     const data = Object.values(months);

//     if (ordersChartInstance) ordersChartInstance.destroy();

//     // Gradient fill under the line
//     const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 260);
//     gradient.addColorStop(0, 'rgba(215, 38, 61, 0.28)');
//     gradient.addColorStop(1, 'rgba(215, 38, 61, 0)');

//     ordersChartInstance = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labels.length ? labels : ['No Data'],
//             datasets: [{
//                 label: 'Orders',
//                 data: data.length ? data : [0],
//                 borderColor: '#D7263D',
//                 backgroundColor: gradient,
//                 fill: true,
//                 tension: 0.4,
//                 pointBackgroundColor: '#F5A623',
//                 pointBorderColor: '#FFFFFF',
//                 pointBorderWidth: 2,
//                 pointRadius: 5,
//                 pointHoverRadius: 7,
//                 borderWidth: 3,
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: { display: false },
//                 tooltip: {
//                     backgroundColor: '#3A2417',
//                     titleFont: { family: 'Poppins', size: 12 },
//                     bodyFont: { family: 'Poppins', size: 12 },
//                     padding: 10,
//                     cornerRadius: 8,
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true,
//                     ticks: {
//                         stepSize: 1,
//                         font: { size: 10 }
//                     },
//                     grid: { color: 'rgba(92,58,37,0.06)' }
//                 },
//                 x: {
//                     grid: { display: false },
//                     ticks: { font: { size: 10 } }
//                 }
//             }
//         }
//     });
// }

// // ---------- Recent Orders panel ----------
// function moneyFmt(n) {
//     return '₹' + Math.round(n || 0).toLocaleString('en-IN');
// }

// function statusBadgeClass(status) {
//     const map = {
//         pending: 'pending',
//         confirmed: 'processing',
//         processing: 'processing',
//         shipped: 'shipped',
//         delivered: 'delivered',
//         cancelled: 'cancelled',
//     };
//     return map[status] || 'pending';
// }

// function renderRecentOrders(orders) {
//     const wrap = document.getElementById('recentOrdersBody');
//     if (!wrap) return;

//     if (!orders.length) {
//         wrap.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-shopping-cart"></i> No orders yet</div></td></tr>`;
//         return;
//     }

//     const recent = [...orders]
//         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//         .slice(0, 5);

//     wrap.innerHTML = recent.map(o => `
//         <tr>
//             <td class="font-mono text-xs">${o.orderNumber || '-'}</td>
//             <td>${o.customer?.name || '-'}</td>
//             <td>${moneyFmt(o.totalAmount)}</td>
//             <td><span class="badge-status ${statusBadgeClass(o.status)}">${o.status || 'pending'}</span></td>
//             <td class="text-xs">${new Date(o.createdAt).toLocaleDateString()}</td>
//         </tr>
//     `).join('');
// }

// // ✅ Helper function for safe JSON parsing
// async function safeJson(res) {
//     try {
//         const text = await res.text();
//         if (!text || text.trim() === '') {
//             return [];
//         }
//         return JSON.parse(text);
//     } catch (e) {
//         console.error('JSON parse error:', e);
//         return [];
//     }
// }









// ============================================================
//  Dashboard page logic
// ============================================================

let categoryChartInstance = null;
let ordersChartInstance = null;

(function init() {
    const user = initAdminShell('dashboard');
    if (!user) return;
    loadDashboard();
    tickClock();
    setInterval(tickClock, 1000);
})();

function tickClock() {
    const el = document.getElementById('liveClock');
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

async function loadDashboard() {
    try {
        const fetchAll = async (path) => {
            try {
                const res = await apiFetch(path);
                if (!res.ok) {
                    console.error(`HTTP ${res.status} from ${path}`);
                    return [];
                }
                const data = await safeJson(res);

                if (Array.isArray(data)) {
                    return data;
                } else if (data && typeof data === 'object') {
                    if (Array.isArray(data.data)) return data.data;
                    if (Array.isArray(data.orders)) return data.orders;
                    if (Array.isArray(data.products)) return data.products;
                    if (Array.isArray(data.items)) return data.items;
                    if (Array.isArray(data.results)) return data.results;

                    console.warn(`Unexpected response structure from ${path}:`, data);
                    return [];
                }
                return [];
            } catch (e) {
                console.error(`Error fetching ${path}:`, e);
                return [];
            }
        };

        const [products, testimonials, orders, contacts, users] = await Promise.all([
            fetchAll('/api/products'),
            fetchAll('/api/testimonials'),
            fetchAll('/api/orders'),
            fetchAll('/api/contact'),
            fetchAll('/api/auth/users'),
        ]);

        const safeOrders = Array.isArray(orders) ? orders : [];
        const safeProducts = Array.isArray(products) ? products : [];

        // ---- Core counts (animated) ----
        animateCount('statProducts', safeProducts.length);
        animateCount('statTestimonials', Array.isArray(testimonials) ? testimonials.length : 0);
        animateCount('statOrders', safeOrders.length);
        animateCount('statContacts', Array.isArray(contacts) ? contacts.length : 0);
        animateCount('statUsers', Array.isArray(users) ? users.length : 0);

        // ---- Revenue + Avg Order Value ----
        const revenueOrders = safeOrders.filter(o => o.status !== 'cancelled');
        const revenue = revenueOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const avgOrder = revenueOrders.length ? revenue / revenueOrders.length : 0;

        animateCount('statRevenue', Math.round(revenue), '₹');
        animateCount('statAvgOrder', Math.round(avgOrder), '₹');

        // ---- Pending / today counts for the mini badges ----
        const pendingCount = safeOrders.filter(o => o.status === 'pending').length;
        const todayCount = safeOrders.filter(o => isToday(o.createdAt)).length;
        setText('statOrdersSub', `${pendingCount} pending`);
        setText('statProductsSub', todayCount ? `${todayCount} orders today` : 'No orders today');

        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

        updateCategoryChart(safeProducts);
        updateOrdersChart(safeOrders);
        renderRecentOrders(safeOrders);
        renderTopProducts(safeOrders);
    } catch (e) {
        showToast('Error loading dashboard: ' + e.message, true);
        console.error(e);
    }
}

function isToday(dateStr) {
    try {
        const d = new Date(dateStr);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    } catch {
        return false;
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// ---------- Animated count-up for stat cards ----------
function animateCount(id, target, prefix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    const duration = 900;
    const start = performance.now();
    const from = 0;

    function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = Math.round(from + (target - from) * eased);
        el.textContent = prefix + value.toLocaleString('en-IN');
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

function updateCategoryChart(products) {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    if (!Array.isArray(products)) {
        console.error('updateCategoryChart: products is not an array', products);
        products = [];
    }

    const categories = {};
    products.forEach(p => {
        const cat = p.category || 'other';
        categories[cat] = (categories[cat] || 0) + 1;
    });

    const labels = Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1));
    const data = Object.values(categories);
    const colors = ['#F5A623', '#D7263D', '#5F7A4F', '#3b82f6', '#8b5cf6', '#ec4899'];

    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Products'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: colors.slice(0, Math.max(data.length, 1)),
                borderWidth: 3,
                borderColor: '#FFFFFF',
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { animateScale: true, animateRotate: true },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 12,
                        font: { size: 11, family: 'Poppins' },
                        color: '#3A2417'
                    }
                }
            },
            cutout: '65%',
        }
    });
}

// ---------- Monthly Orders: line graph with gradient fill ----------
function updateOrdersChart(orders) {
    const canvas = document.getElementById('ordersChart');
    const ctx = canvas.getContext('2d');

    if (!Array.isArray(orders)) {
        console.error('updateOrdersChart: orders is not an array', orders);
        orders = [];
    }

    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        months[key] = 0;
    }

    orders.forEach(o => {
        try {
            const d = new Date(o.createdAt);
            const key = d.toLocaleString('default', { month: 'short' });
            if (months[key] !== undefined) months[key] += 1;
        } catch (e) {
            console.warn('Error processing order date:', e, o);
        }
    });

    const labels = Object.keys(months);
    const data = Object.values(months);

    if (ordersChartInstance) ordersChartInstance.destroy();

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height || 260);
    gradient.addColorStop(0, 'rgba(215, 38, 61, 0.28)');
    gradient.addColorStop(1, 'rgba(215, 38, 61, 0)');

    ordersChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                label: 'Orders',
                data: data.length ? data : [0],
                borderColor: '#D7263D',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#F5A623',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8,
                borderWidth: 3,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 900, easing: 'easeOutCubic' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#3A2417',
                    titleFont: { family: 'Poppins', size: 12 },
                    bodyFont: { family: 'Poppins', size: 12 },
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { size: 10 } },
                    grid: { color: 'rgba(92,58,37,0.06)' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10 } }
                }
            }
        }
    });
}

// ---------- Recent Orders panel ----------
function moneyFmt(n) {
    return '₹' + Math.round(n || 0).toLocaleString('en-IN');
}

function statusBadgeClass(status) {
    const map = {
        pending: 'pending',
        confirmed: 'processing',
        processing: 'processing',
        shipped: 'shipped',
        delivered: 'delivered',
        cancelled: 'cancelled',
    };
    return map[status] || 'pending';
}

function initials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}

const AVATAR_COLORS = ['#F5A623', '#D7263D', '#5F7A4F', '#3b82f6', '#8b5cf6', '#ec4899', '#0d9488'];
function avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function renderRecentOrders(orders) {
    const wrap = document.getElementById('recentOrdersBody');
    if (!wrap) return;

    if (!orders.length) {
        wrap.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-shopping-cart"></i> No orders yet</div></td></tr>`;
        return;
    }

    const recent = [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    wrap.innerHTML = recent.map((o, i) => `
        <tr style="animation: rowIn .4s ease both; animation-delay:${i * 0.05}s;">
            <td>
                <div style="display:flex; align-items:center; gap:.6rem;">
                    <div class="row-avatar" style="background:${avatarColor(o.customer?.name || '?')};">${initials(o.customer?.name)}</div>
                    <div>
                        <div style="font-weight:600; font-size:.85rem;">${o.customer?.name || '-'}</div>
                        <div class="font-mono" style="font-size:.68rem; color:#b5a99a;">${o.orderNumber || '-'}</div>
                    </div>
                </div>
            </td>
            <td class="font-semibold">${moneyFmt(o.totalAmount)}</td>
            <td><span class="badge-status ${statusBadgeClass(o.status)}">${o.status || 'pending'}</span></td>
            <td class="text-xs" style="color:#9a8a7a;">${new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
            <td><a href="orders.html" class="row-link"><i class="fas fa-arrow-right"></i></a></td>
        </tr>
    `).join('');
}

// ---------- Top Products leaderboard ----------
function renderTopProducts(orders) {
    const wrap = document.getElementById('topProductsList');
    if (!wrap) return;

    const counts = {};
    orders.forEach(o => {
        (o.items || []).forEach(item => {
            const key = item.name || 'Unknown';
            counts[key] = (counts[key] || 0) + (item.qty || 1);
        });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    if (!sorted.length) {
        wrap.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i> No sales data yet</div>`;
        return;
    }

    const maxQty = sorted[0][1];
    const barColors = ['#D7263D', '#F5A623', '#5F7A4F', '#3b82f6', '#8b5cf6'];

    wrap.innerHTML = sorted.map(([name, qty], i) => `
        <div class="top-product-row" style="animation: rowIn .4s ease both; animation-delay:${i * 0.06}s;">
            <div class="top-product-rank" style="background:${barColors[i]};">${i + 1}</div>
            <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; font-size:.82rem; margin-bottom:.3rem;">
                    <span class="font-semibold" style="color:#5C3A25; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${name}</span>
                    <span style="color:#9a8a7a; flex-shrink:0; margin-left:.5rem;">${qty} sold</span>
                </div>
                <div class="top-product-track">
                    <div class="top-product-fill" style="width:${(qty / maxQty) * 100}%; background:${barColors[i]};"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// ✅ Helper function for safe JSON parsing
async function safeJson(res) {
    try {
        const text = await res.text();
        if (!text || text.trim() === '') {
            return [];
        }
        return JSON.parse(text);
    } catch (e) {
        console.error('JSON parse error:', e);
        return [];
    }
}