// ============================================================
//  Companies page logic
// ============================================================

(function init() {
    const user = initAdminShell('companies');
    if (!user) return;
    loadCompanies();
})();

const companyImageFileInput = document.getElementById('cLogoFile');
const companyImagePreview = document.getElementById('cLogoPreview');
const companyImageUploadStatus = document.getElementById('companyImageUploadStatus');

companyImageFileInput.addEventListener('change', () => {
    const file = companyImageFileInput.files[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    companyImagePreview.src = localPreviewUrl;
    companyImagePreview.classList.add('show');
    companyImageUploadStatus.textContent = 'Logo selected ✓';
    companyImageUploadStatus.className = 'image-upload-status success';
});

function toggleCompanyActive() {
    const toggle = document.getElementById('companyActiveToggle');
    const hidden = document.getElementById('cIsActive');
    const label = document.getElementById('companyActiveLabel');
    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';
}

async function loadCompanies() {
    try {
        const res = await apiFetch('/api/companies');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = json.data || json;
        const tbody = document.getElementById('companiesTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-building"></i> No companies found</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(c => `
                    <tr>
                        <td>${c.logo ? `<img src="${c.logo}" alt="${c.altText || c.name}" class="product-thumb" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'product-thumb-placeholder\\'><i class=\\'fas fa-image\\'></i></div>';" />` : '<div class="product-thumb-placeholder"><i class="fas fa-image"></i></div>'}</td>
                        <td class="font-medium">${c.name}</td>
                        <td class="max-w-xs truncate">${c.altText || ''}</td>
                        <td>${c.order ?? 0}</td>
                        <td><span class="status-badge ${c.isActive ? 'active' : 'inactive'}">${c.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="editCompany('${c._id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn-danger" onclick="deleteCompany('${c._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        showToast('Failed to load companies: ' + e.message, true);
        console.error(e);
    }
}

function openCompanyModal(data = null) {
    const isEdit = !!data;
    document.getElementById('companyModalTitle').innerHTML =
        `<i class="fas fa-building"></i> ${isEdit ? 'Edit Company' : 'Add Company'}`;
    document.getElementById('companyId').value = data?._id || '';
    document.getElementById('cName').value = data?.name || '';
    document.getElementById('cAltText').value = data?.altText || '';
    document.getElementById('cOrder').value = data?.order ?? 0;
    const isActive = data?.isActive !== undefined ? data.isActive : true;
    const toggle = document.getElementById('companyActiveToggle');
    const hidden = document.getElementById('cIsActive');
    const label = document.getElementById('companyActiveLabel');
    if (isActive) {
        toggle.classList.add('active');
        hidden.value = 'true';
        label.textContent = 'Yes, visible on site';
    } else {
        toggle.classList.remove('active');
        hidden.value = 'false';
        label.textContent = 'No, hidden';
    }
    if (data?.logo) {
        companyImagePreview.src = data.logo;
        companyImagePreview.classList.add('show');
    } else {
        companyImagePreview.src = '';
        companyImagePreview.classList.remove('show');
    }
    companyImageUploadStatus.textContent = '';
    companyImageUploadStatus.className = 'image-upload-status';
    companyImageFileInput.value = '';
    openModal('companyModal');
}

async function editCompany(id) {
    try {
        const res = await apiFetch('/api/companies/' + id);
        if (!res.ok) throw new Error('Company not found');
        const json = await safeJson(res);
        openCompanyModal(json.data || json);
    } catch (e) {
        showToast('Error loading company: ' + e.message, true);
        console.error(e);
    }
}

document.getElementById('companyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('companyId').value;
    const saveBtn = document.getElementById('companySaveBtn');
    const file = companyImageFileInput.files[0];
    if (!id && !file) {
        companyImageUploadStatus.textContent = 'Please select a logo image before saving.';
        companyImageUploadStatus.className = 'image-upload-status error';
        return;
    }
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    try {
        const formData = new FormData();
        formData.append('name', document.getElementById('cName').value.trim());
        formData.append('altText', document.getElementById('cAltText').value.trim());
        formData.append('order', document.getElementById('cOrder').value || 0);
        formData.append('isActive', document.getElementById('cIsActive').value === 'true');
        if (file) formData.append('logo', file);

        const token = getAuthToken();
        const path = id ? `${API_BASE_URL}/api/companies/${id}` : `${API_BASE_URL}/api/companies`;
        const res = await fetch(path, {
            method: id ? 'PUT' : 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) {
            throw new Error(json.message || 'Failed to save company');
        }
        showToast(id ? 'Company updated' : 'Company created');
        closeModal('companyModal');
        loadCompanies();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving company: ' + e.message, true);
        console.error(e);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Company';
    }
});

async function deleteCompany(id) {
    if (!confirm('Delete this company?')) return;
    try {
        const res = await apiFetch('/api/companies/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Company deleted');
        loadCompanies();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting company: ' + e.message, true);
        console.error(e);
    }
}

window.openCompanyModal = openCompanyModal;
window.editCompany = editCompany;
window.deleteCompany = deleteCompany;
window.toggleCompanyActive = toggleCompanyActive;
