// ============================================================
//  Orders page logic
// ============================================================

(function init() {
    const user = initAdminShell('orders');
    if (!user) return;
    loadOrders();
})();

async function loadOrders() {
    try {
        const res = await apiFetch('/api/orders');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await safeJson(res);
        const tbody = document.getElementById('ordersTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-shopping-cart"></i> No orders</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(o => `
                    <tr>
                        <td class="font-mono text-xs">#${o._id.slice(-6)}</td>
                        <td>${o.customer.name}<br><span class="text-xs text-slate-400">${o.customer.email}</span></td>
                        <td>₹${o.totalAmount}</td>
                        <td><span class="badge-status ${o.status}">${o.status}</span></td>
                        <td>${new Date(o.createdAt).toLocaleDateString()}</td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="openOrderStatusModal('${o._id}','${o.status}')"><i class="fas fa-sync-alt"></i></button>
                            <button class="btn-danger" onclick="deleteOrder('${o._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        showToast('Failed to load orders: ' + e.message, true);
        console.error(e);
    }
}

function openOrderStatusModal(id, currentStatus) {
    document.getElementById('orderStatusId').value = id;
    document.getElementById('orderStatusSelect').value = currentStatus;
    openModal('orderStatusModal');
}

document.getElementById('updateOrderStatusBtn').addEventListener('click', async () => {
    const id = document.getElementById('orderStatusId').value;
    const status = document.getElementById('orderStatusSelect').value;
    try {
        const res = await apiFetch('/api/orders/' + id, { method: 'PUT', body: JSON.stringify({ status }) });
        if (!res.ok) throw new Error('Update failed');
        showToast('Order status updated');
        closeModal('orderStatusModal');
        loadOrders();
        loadNavCounts();
    } catch (e) {
        showToast('Error updating order: ' + e.message, true);
        console.error(e);
    }
});

async function deleteOrder(id) {
    if (!confirm('Delete this order?')) return;
    try {
        const res = await apiFetch('/api/orders/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Order deleted');
        loadOrders();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting order: ' + e.message, true);
        console.error(e);
    }
}

window.openOrderStatusModal = openOrderStatusModal;
window.deleteOrder = deleteOrder;
