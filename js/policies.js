// ============================================================
//  Policies & Factory Address page logic
// ============================================================

(function init() {
    const user = initAdminShell('policies');
    if (!user) return;
    loadPolicies();
})();

async function loadPolicies() {
    try {
        const res = await apiFetch('/api/site-settings');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        if (json.success && json.data) {
            const data = json.data;
            document.getElementById('contactPhoneInput').value = data.contactPhone || '';
            document.getElementById('contactEmailInput').value = data.contactEmail || '';
            document.getElementById('contactAddressInput').value = data.contactAddress || '';
            document.getElementById('factoryNameInput').value = data.factoryName || '';
            document.getElementById('factoryAddressInput').value = data.factoryAddress || '';
            document.getElementById('disclaimerInput').value = data.disclaimer || '';
            document.getElementById('returnPolicyInput').value = data.returnPolicy || '';
            document.getElementById('refundPolicyInput').value = data.refundPolicy || '';
            document.getElementById('cancellationPolicyInput').value = data.cancellationPolicy || '';
        }
    } catch (e) {
        showToast('Error loading policies: ' + e.message, true);
        console.error(e);
    }
}

async function savePolicies() {
    const saveBtn = document.querySelector('#main .btn-primary');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }

    const payload = {
        contactPhone: document.getElementById('contactPhoneInput').value.trim(),
        contactEmail: document.getElementById('contactEmailInput').value.trim(),
        contactAddress: document.getElementById('contactAddressInput').value.trim(),
        factoryName: document.getElementById('factoryNameInput').value.trim(),
        factoryAddress: document.getElementById('factoryAddressInput').value.trim(),
        disclaimer: document.getElementById('disclaimerInput').value.trim(),
        returnPolicy: document.getElementById('returnPolicyInput').value.trim(),
        refundPolicy: document.getElementById('refundPolicyInput').value.trim(),
        cancellationPolicy: document.getElementById('cancellationPolicyInput').value.trim(),
    };

    try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE_URL}/api/site-settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || !json.success) {
            throw new Error(json.message || `HTTP ${res.status}`);
        }

        showToast('✅ Policies & factory address updated successfully!');
        await loadPolicies();
    } catch (e) {
        showToast('❌ Error saving: ' + e.message, true);
        console.error(e);
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }
}

window.loadPolicies = loadPolicies;
window.savePolicies = savePolicies;
