// ============================================================
//  Dashboard page logic
// ============================================================

let categoryChartInstance = null;
let ordersChartInstance = null;

(function init() {
    const user = initAdminShell('dashboard');
    if (!user) return;
    loadDashboard();
})();

async function loadDashboard() {
    try {
        const fetchAll = async (path) => {
            try {
                const res = await apiFetch(path);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await safeJson(res);
            } catch (e) { console.error(`Error fetching ${path}:`, e); return []; }
        };
        const [products, testimonials, orders, contacts] = await Promise.all([
            fetchAll('/api/products'),
            fetchAll('/api/testimonials'),
            fetchAll('/api/orders'),
            fetchAll('/api/contact'),
        ]);

        document.getElementById('statProducts').textContent = products.length;
        document.getElementById('statTestimonials').textContent = testimonials.length;
        document.getElementById('statOrders').textContent = orders.length;
        document.getElementById('statContacts').textContent = contacts.length;

        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

        updateCategoryChart(products);
        updateOrdersChart(orders);
    } catch (e) {
        showToast('Error loading dashboard: ' + e.message, true);
        console.error(e);
    }
}

function updateCategoryChart(products) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const categories = {};
    products.forEach(p => {
        const cat = p.category || 'other';
        categories[cat] = (categories[cat] || 0) + 1;
    });
    const labels = Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1));
    const data = Object.values(categories);
    const colors = ['#E8A33D', '#A63A2E', '#5F7A4F', '#3b82f6', '#8b5cf6', '#ec4899'];
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length ? labels : ['No Products'],
            datasets: [{
                data: data.length ? data : [1],
                backgroundColor: colors.slice(0, Math.max(data.length, 1)),
                borderWidth: 2,
                borderColor: '#FBF1E2',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 10, font: { size: 10, family: 'Poppins' }, color: '#3A2417' } }
            },
            cutout: '60%',
        }
    });
}

function updateOrdersChart(orders) {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString('default', { month: 'short' });
        months[key] = 0;
    }
    orders.forEach(o => {
        const d = new Date(o.createdAt);
        const key = d.toLocaleString('default', { month: 'short' });
        if (months[key] !== undefined) months[key] += 1;
    });
    const labels = Object.keys(months);
    const data = Object.values(months);
    if (ordersChartInstance) ordersChartInstance.destroy();
    ordersChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.length ? labels : ['No Data'],
            datasets: [{
                label: 'Orders',
                data: data.length ? data : [0],
                backgroundColor: ['#E8A33D', '#A63A2E', '#5F7A4F', '#3b82f6', '#8b5cf6', '#ec4899'],
                borderRadius: 4,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } }, grid: { color: 'rgba(0,0,0,0.04)' } },
                x: { grid: { display: false }, ticks: { font: { size: 10 } } }
            }
        }
    });
}
