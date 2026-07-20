// ============================================================
//  Welcome Leads page logic
//  Backend: GET/POST /api/welcome-leads, GET/PUT/DELETE /api/welcome-leads/:id
//  (POST is public — used by the homepage welcome popup. This page only reads/updates/deletes.)
// ============================================================

let currentLeads = [];

(function init() {
    const user = initAdminShell('welcomeLeads');
    if (!user) return;
    loadLeads();

    document.getElementById('leadStatusFilter').addEventListener('change', () => loadLeads());
})();

function statusBadge(status) {
    const s = status || 'new';
    const label = s.charAt(0).toUpperCase() + s.slice(1);
    return `<span class="badge-status ${s}">${label}</span>`;
}

async function loadLeads() {
    const tbody = document.getElementById('leadsTableBody');
    const filter = document.getElementById('leadStatusFilter').value;
    const path = filter ? `/api/welcome-leads?status=${encodeURIComponent(filter)}` : '/api/welcome-leads';

    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-slate-400"><i class="fas fa-spinner fa-spin mr-2"></i> Loading...</td></tr>`;

    try {
        const res = await apiFetch(path);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = json.data || json;
        currentLeads = Array.isArray(data) ? data : [];

        if (!currentLeads.length) {
            tbody.innerHTML =
                `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-user-plus"></i> No leads found</div></td></tr>`;
            return;
        }

        tbody.innerHTML = currentLeads.map(l => `
                    <tr>
                        <td class="font-medium">${l.name || ''}</td>
                        <td><a href="mailto:${l.email}" class="text-kumkum underline">${l.email || ''}</a></td>
                        <td>${l.phone || ''}</td>
                        <td class="text-xs text-slate-400">${l.source || '—'}</td>
                        <td>${statusBadge(l.status)}</td>
                        <td>${l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''}</td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="viewLeadDetails('${l._id}')" title="View details"><i class="fas fa-eye"></i></button>
                            <button class="btn-secondary" style="padding:0.35rem 0.7rem; font-size:0.75rem;" onclick="openLeadStatusModal('${l._id}','${l.status || 'new'}')" title="Update status"><i class="fas fa-sync-alt"></i></button>
                            <button class="btn-danger" onclick="deleteLead('${l._id}')" title="Delete"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-triangle-exclamation"></i> Failed to load leads</div></td></tr>`;
        showToast('Failed to load leads: ' + e.message, true);
        console.error(e);
    }
}

function viewLeadDetails(id) {
    const lead = currentLeads.find(l => l._id === id);
    if (!lead) {
        showToast('Lead not found', true);
        return;
    }
    document.getElementById('ldName').textContent = lead.name || '—';
    document.getElementById('ldEmail').textContent = lead.email || '—';
    document.getElementById('ldPhone').textContent = lead.phone || '—';
    document.getElementById('ldSource').textContent = lead.source || '—';
    document.getElementById('ldCoupon').textContent = lead.coupon || '—';
    document.getElementById('ldDate').textContent = lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '—';
    document.getElementById('ldStatus').innerHTML = statusBadge(lead.status);
    openModal('leadDetailsModal');
}

function openLeadStatusModal(id, currentStatus) {
    document.getElementById('leadStatusId').value = id;
    document.getElementById('leadStatusSelect').value = currentStatus || 'new';
    openModal('leadStatusModal');
}

document.getElementById('updateLeadStatusBtn').addEventListener('click', async () => {
    const id = document.getElementById('leadStatusId').value;
    const status = document.getElementById('leadStatusSelect').value;
    try {
        const res = await apiFetch('/api/welcome-leads/' + id, { method: 'PUT', body: JSON.stringify({ status }) });
        if (!res.ok) throw new Error('Update failed');
        showToast('Lead status updated');
        closeModal('leadStatusModal');
        loadLeads();
        loadNavCounts();
    } catch (e) {
        showToast('Error updating lead: ' + e.message, true);
        console.error(e);
    }
});

async function deleteLead(id) {
    if (!confirm('Delete this lead?')) return;
    try {
        const res = await apiFetch('/api/welcome-leads/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Lead deleted');
        loadLeads();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting lead: ' + e.message, true);
        console.error(e);
    }
}

window.viewLeadDetails = viewLeadDetails;
window.openLeadStatusModal = openLeadStatusModal;
window.deleteLead = deleteLead;