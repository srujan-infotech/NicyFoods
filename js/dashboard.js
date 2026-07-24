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
                if (!res.ok) {
                    console.error(`HTTP ${res.status} from ${path}`);
                    return [];
                }
                const data = await safeJson(res);
                
                // ✅ Ensure we always return an array
                if (Array.isArray(data)) {
                    return data;
                } else if (data && typeof data === 'object') {
                    // Handle common API response patterns
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
        
        const [products, testimonials, orders, contacts] = await Promise.all([
            fetchAll('/api/products'),
            fetchAll('/api/testimonials'),
            fetchAll('/api/orders'),
            fetchAll('/api/contact'),
        ]);

        // ✅ Safety checks before using .length
        document.getElementById('statProducts').textContent = Array.isArray(products) ? products.length : 0;
        document.getElementById('statTestimonials').textContent = Array.isArray(testimonials) ? testimonials.length : 0;
        document.getElementById('statOrders').textContent = Array.isArray(orders) ? orders.length : 0;
        document.getElementById('statContacts').textContent = Array.isArray(contacts) ? contacts.length : 0;

        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

        // ✅ Always pass arrays
        updateCategoryChart(Array.isArray(products) ? products : []);
        updateOrdersChart(Array.isArray(orders) ? orders : []);
    } catch (e) {
        showToast('Error loading dashboard: ' + e.message, true);
        console.error(e);
    }
}

function updateCategoryChart(products) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // ✅ Ensure products is an array
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
                legend: { 
                    position: 'bottom', 
                    labels: { 
                        boxWidth: 12, 
                        padding: 10, 
                        font: { size: 10, family: 'Poppins' }, 
                        color: '#3A2417' 
                    } 
                }
            },
            cutout: '60%',
        }
    });
}

function updateOrdersChart(orders) {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    
    // ✅ Ensure orders is an array
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
    
    // ✅ Safe forEach with array check
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
            plugins: { 
                legend: { display: false } 
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { 
                        stepSize: 1, 
                        font: { size: 10 } 
                    }, 
                    grid: { color: 'rgba(0,0,0,0.04)' } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { font: { size: 10 } } 
                }
            }
        }
    });
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