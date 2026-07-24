// ============================================================
//  Registered Users page logic
// ============================================================

const USERS_API_URL = '/api/auth/users';
let currentAdminId = null;

(function init() {
    const user = initAdminShell('users');
    if (!user) return;
    currentAdminId = user._id || user.id;
    loadUsers();
})();

function initials(name, email) {
    const source = (name || email || 'U').trim();
    return source.charAt(0).toUpperCase();
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '—';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return '—';
    }
}

async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-spinner fa-spin"></i> Loading users...</div></td></tr>`;

    try {
        const res = await apiFetch(USERS_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const users = json.data || [];

        document.getElementById('statTotalUsers').textContent = users.length;
        const admins = users.filter(u => u.role === 'admin').length;
        document.getElementById('statAdminUsers').textContent = admins;
        document.getElementById('statRegularUsers').textContent = users.length - admins;

        const badge = document.getElementById('navUserCount');
        if (badge) badge.textContent = users.length;

        if (!users.length) {
            tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-user-slash"></i> No users registered yet</div></td></tr>`;
            return;
        }

        users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        tbody.innerHTML = users.map(u => {
            const isSelf = u._id === currentAdminId;
            const isAdmin = u.role === 'admin';

            return `
                <tr>
                    <td>
                        <div class="user-cell">
                            <div class="user-avatar">${initials(u.name, u.email)}</div>
                            <span>${u.name || '—'}${isSelf ? ' <span class="you-tag">You</span>' : ''}</span>
                        </div>
                    </td>
                    <td class="text-xs">${u.email || '—'}</td>
                    <td><span class="role-badge ${isAdmin ? 'role-admin' : 'role-user'}"><i class="fas ${isAdmin ? 'fa-shield-alt' : 'fa-user'}"></i> ${u.role || 'user'}</span></td>
                    <td class="text-xs">${formatDate(u.createdAt)}</td>
                    <td class="text-xs">${formatDate(u.updatedAt)}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-role" title="${isAdmin ? 'Demote to user' : 'Promote to admin'}"
                                onclick="toggleUserRole('${u._id}', '${isAdmin ? 'user' : 'admin'}', '${(u.name || u.email || '').replace(/'/g, "\\'")}')"
                                ${isSelf && isAdmin ? 'disabled' : ''}>
                                <i class="fas ${isAdmin ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                            </button>
                            <button class="btn-danger" title="Delete user"
                                onclick="removeUser('${u._id}', '${(u.name || u.email || '').replace(/'/g, "\\'")}')"
                                ${isSelf ? 'disabled' : ''}>
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) {
        tbody.innerHTML = `
            <tr><td colspan="6">
                <div class="empty-state">
                    <i class="fas fa-face-frown"></i> Could not load users: ${e.message}
                </div>
            </td></tr>
        `;
        showToast('Error loading users: ' + e.message, true);
        console.error(e);
    }
}

async function toggleUserRole(id, newRole, label) {
    const verb = newRole === 'admin' ? 'promote' : 'demote';
    if (!confirm(`${verb === 'promote' ? 'Promote' : 'Demote'} "${label}" ${verb === 'promote' ? 'to admin' : 'to regular user'}?`)) return;

    try {
        const res = await apiFetch(`${USERS_API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole }),
        });
        const json = await safeJson(res);
        if (!res.ok || !json.success) throw new Error(json.message || 'Update failed');

        showToast(`✅ ${label} is now ${newRole}`);
        loadUsers();
    } catch (e) {
        showToast('❌ Error updating role: ' + e.message, true);
        console.error(e);
    }
}

async function removeUser(id, label) {
    if (!confirm(`Delete user "${label}"? This cannot be undone.`)) return;

    try {
        const res = await apiFetch(`${USERS_API_URL}/${id}`, { method: 'DELETE' });
        const json = await safeJson(res);
        if (!res.ok || !json.success) throw new Error(json.message || 'Delete failed');

        showToast(`🗑️ ${label} deleted`);
        loadUsers();
    } catch (e) {
        showToast('❌ Error deleting user: ' + e.message, true);
        console.error(e);
    }
}

window.loadUsers = loadUsers;
window.toggleUserRole = toggleUserRole;
window.removeUser = removeUser;