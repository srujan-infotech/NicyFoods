// ============================================================
//  Orders page logic
// ============================================================

const ORDERS_API_BASE = '/api/orders';
let orderSearchDebounce;

(function init() {
    const user = initAdminShell('orders');
    if (!user) return;
    loadOrders();
})();

// ---------- helpers ----------
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
        paid: 'delivered',
        failed: 'cancelled',
        refunded: 'processing',
    };
    return map[status] || 'pending';
}

function debouncedLoadOrders() {
    clearTimeout(orderSearchDebounce);
    orderSearchDebounce = setTimeout(loadOrders, 350);
}

function resetOrderFilters() {
    document.getElementById('orderSearchInput').value = '';
    document.getElementById('orderStatusFilter').value = '';
    document.getElementById('orderPaymentFilter').value = '';
    document.getElementById('orderFromDate').value = '';
    document.getElementById('orderToDate').value = '';
    loadOrders();
}

// ---------- load + render table ----------
async function loadOrders() {
    try {
        const params = new URLSearchParams();
        const search = document.getElementById('orderSearchInput')?.value.trim();
        const status = document.getElementById('orderStatusFilter')?.value;
        const paymentStatus = document.getElementById('orderPaymentFilter')?.value;
        const from = document.getElementById('orderFromDate')?.value;
        const to = document.getElementById('orderToDate')?.value;

        if (search) params.set('search', search);
        if (status) params.set('status', status);
        if (paymentStatus) params.set('paymentStatus', paymentStatus);
        if (from) params.set('from', from);
        if (to) params.set('to', to);

        const query = params.toString() ? `?${params.toString()}` : '';
        const res = await apiFetch(ORDERS_API_BASE + query);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const orders = json.data || [];

        renderStats(orders);

        const tbody = document.getElementById('ordersTableBody');
        if (!orders.length) {
            tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fas fa-shopping-cart"></i> No orders found</div></td></tr>`;
            const badge = document.getElementById('navOrderCount');
            if (badge) badge.textContent = '0';
            return;
        }

        tbody.innerHTML = orders.map(o => {
            const itemCount = (o.items || []).reduce((sum, i) => sum + (i.qty || 1), 0);
            return `
                <tr>
                    <td class="font-mono text-xs">${o.orderNumber}</td>
                    <td>${o.customer?.name || '-'}</td>
                    <td class="text-xs">${o.customer?.phone || '-'}</td>
                    <td>${itemCount} item${itemCount === 1 ? '' : 's'}</td>
                    <td>${moneyFmt(o.totalAmount)}</td>
                    <td><span class="badge-status ${statusBadgeClass(o.paymentStatus)}">${o.paymentStatus || 'pending'}</span></td>
                    <td><span class="badge-status ${statusBadgeClass(o.status)}">${o.status}</span></td>
                    <td>${new Date(o.createdAt).toLocaleDateString()}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="openOrderDetail('${o._id}')"><i class="fas fa-eye"></i></button>
                            <button class="btn-danger" onclick="deleteOrder('${o._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const badge = document.getElementById('navOrderCount');
        if (badge) badge.textContent = orders.length;
    } catch (e) {
        showToast('Failed to load orders: ' + e.message, true);
        console.error(e);
    }
}

function renderStats(orders) {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const shipped = orders.filter(o => o.status === 'shipped').length;
    const revenue = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    document.getElementById('statTotalOrders').textContent = total;
    document.getElementById('statPendingOrders').textContent = pending;
    document.getElementById('statShippedOrders').textContent = shipped;
    document.getElementById('statRevenue').textContent = moneyFmt(revenue);
}

// ---------- order detail modal ----------
async function openOrderDetail(id) {
    try {
        const res = await apiFetch(`${ORDERS_API_BASE}/${id}`);
        if (!res.ok) throw new Error('Order not found');
        const json = await safeJson(res);
        const order = json.data;

        document.getElementById('odOrderId').value = order._id;
        document.getElementById('odOrderNumber').textContent = order.orderNumber;

        document.getElementById('odCustName').textContent = order.customer?.name || '-';
        document.getElementById('odCustPhone').textContent = order.customer?.phone || '-';
        document.getElementById('odCustEmail').textContent = order.customer?.email || '—';

        const a = order.shippingAddress || {};
        document.getElementById('odAddress').innerHTML =
            `${a.line1 || ''}${a.line2 ? ', ' + a.line2 : ''}<br>${a.city || ''}, ${a.state || ''} - ${a.pincode || ''}<br>${a.country || 'India'}`;

        const paymentBadge = document.getElementById('odPaymentBadge');
        paymentBadge.textContent = order.paymentStatus || 'pending';
        paymentBadge.className = `status-badge ${statusBadgeClass(order.paymentStatus)}`;

        document.getElementById('odItemsBody').innerHTML = (order.items || []).map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.weightLabel || '-'}</td>
                <td>${moneyFmt(item.price)}</td>
                <td>${item.qty}</td>
                <td>${moneyFmt(item.price * item.qty)}</td>
            </tr>
        `).join('');

        document.getElementById('odTimeline').innerHTML = (order.statusHistory || []).map(h => `
            <div class="step-mini">
                <span class="dot"></span>
                <span><strong>${h.status}</strong> — ${new Date(h.changedAt).toLocaleString()}${h.note ? ' — ' + h.note : ''}</span>
            </div>
        `).join('') || '<p class="text-xs text-slate-400">No history yet.</p>';

        document.getElementById('odStatus').value = order.status;
        document.getElementById('odCourierCharge').value = order.courierCharge || 0;
        document.getElementById('odPaymentStatus').value = order.paymentStatus || 'pending';
        document.getElementById('odNotes').value = order.notes || '';
        document.getElementById('odStatusNote').value = '';
        document.getElementById('odSubtotal').textContent = moneyFmt(order.subtotal);
        document.getElementById('odTotal').textContent = moneyFmt(order.totalAmount);

        openModal('orderDetailModal');
    } catch (e) {
        showToast('Error loading order: ' + e.message, true);
        console.error(e);
    }
}

// ---------- save changes ----------
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('orderUpdateForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('odOrderId').value;
        const saveBtn = document.getElementById('odSaveBtn');

        const payload = {
            status: document.getElementById('odStatus').value,
            courierCharge: parseFloat(document.getElementById('odCourierCharge').value) || 0,
            paymentStatus: document.getElementById('odPaymentStatus').value,
            notes: document.getElementById('odNotes').value.trim(),
            note: document.getElementById('odStatusNote').value.trim(),
        };

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            const res = await apiFetch(`${ORDERS_API_BASE}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });
            const json = await safeJson(res);
            if (!res.ok || !json.success) throw new Error(json.message || 'Update failed');

            showToast('✅ Order updated');
            closeModal('orderDetailModal');
            loadOrders();
        } catch (e) {
            showToast('❌ Error updating order: ' + e.message, true);
            console.error(e);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        }
    });
});

// ---------- delete ----------
async function deleteOrder(id) {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
        const res = await apiFetch(`${ORDERS_API_BASE}/${id}`, { method: 'DELETE' });
        const json = await safeJson(res);
        if (!res.ok || !json.success) throw new Error(json.message || 'Delete failed');
        showToast('🗑️ Order deleted');
        closeModal('orderDetailModal');
        loadOrders();
    } catch (e) {
        showToast('❌ Error deleting order: ' + e.message, true);
        console.error(e);
    }
}

// Expose globally so onclick="" handlers in the HTML can reach them
window.loadOrders = loadOrders;
window.debouncedLoadOrders = debouncedLoadOrders;
window.resetOrderFilters = resetOrderFilters;
window.openOrderDetail = openOrderDetail;
window.deleteOrder = deleteOrder;