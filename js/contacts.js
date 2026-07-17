// ============================================================
//  Contacts (messages) page logic
// ============================================================

(function init() {
    const user = initAdminShell('contacts');
    if (!user) return;
    loadContacts();
})();

async function loadContacts() {
    try {
        const res = await apiFetch('/api/contact');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await safeJson(res);
        const tbody = document.getElementById('contactsTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-inbox"></i> No messages</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(c => `
                    <tr>
                        <td class="font-medium">${c.name}</td>
                        <td><a href="mailto:${c.email}" class="text-kumkum underline">${c.email}</a></td>
                        <td class="max-w-xs truncate">${c.message}</td>
                        <td>${new Date(c.createdAt).toLocaleDateString()}</td>
                        <td>
                        <button class="btn-danger" onclick="deleteContact('${c._id}')"><i class="fas fa-trash-alt"></i></button>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        showToast('Failed to load messages: ' + e.message, true);
        console.error(e);
    }
}

async function deleteContact(id) {
    if (!confirm('Delete this message?')) return;
    try {
        const res = await apiFetch('/api/contact/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Message deleted');
        loadContacts();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting message: ' + e.message, true);
        console.error(e);
    }
}

window.deleteContact = deleteContact;
