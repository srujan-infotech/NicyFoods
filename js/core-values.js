// ============================================================
//  Core Values page logic
// ============================================================

(function init() {
    const user = initAdminShell('coreValues');
    if (!user) return;
    loadCoreValues();
})();

function toggleCoreValueActive() {
    const toggle = document.getElementById('coreValueActiveToggle');
    const hidden = document.getElementById('cvIsActive');
    const label = document.getElementById('coreValueActiveLabel');
    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';
}

const cvIconFileInput = document.getElementById('cvIconFile');
const cvIconPreview = document.getElementById('cvIconPreview');
const cvIconUploadStatus = document.getElementById('coreValueImageUploadStatus');
const cvIconHidden = document.getElementById('cvIcon');

cvIconFileInput.addEventListener('change', async () => {
    const file = cvIconFileInput.files[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    cvIconPreview.src = localPreviewUrl;
    cvIconPreview.classList.add('show');
    cvIconUploadStatus.textContent = 'Uploading...';
    cvIconUploadStatus.className = 'image-upload-status uploading';
    try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadFetch(`${API_BASE_URL}/api/upload`, formData);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed');
        cvIconHidden.value = data.url;
        cvIconUploadStatus.textContent = 'Icon uploaded ✓';
        cvIconUploadStatus.className = 'image-upload-status success';
    } catch (e) {
        console.error(e);
        cvIconUploadStatus.textContent = e instanceof TypeError ?
            "Can't reach the server. Check backend & API_BASE_URL." :
            "Couldn't upload icon. Please try again.";
        cvIconUploadStatus.className = 'image-upload-status error';
        cvIconHidden.value = '';
    }
});

function renderCoreValueIconCell(v) {
    const bg = v.iconBgColor || 'bg-amber-100';
    return v.icon ?
        `<div class="core-value-icon-preview ${bg}"><img src="${v.icon}" alt="${v.title || ''}" style="width:22px;height:22px;object-fit:contain;" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-image\\' style=\\'color:#cbb9ab;font-size:1.1rem;\\'></i>';" /></div>` :
        `<div class="core-value-icon-preview ${bg}"><i class="fas fa-image" style="color:#cbb9ab;"></i></div>`;
}

async function loadCoreValues() {
    try {
        const res = await apiFetch('/api/core-values');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = (json.data || json).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const tbody = document.getElementById('coreValuesTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-gem"></i> No core values found</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(v => `
                    <tr>
                        <td>${renderCoreValueIconCell(v)}</td>
                        <td class="font-medium">${v.title}</td>
                        <td class="max-w-xs truncate">${v.description || ''}</td>
                        <td>${v.order ?? 0}</td>
                        <td><span class="status-badge ${v.isActive ? 'active' : 'inactive'}">${v.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="editCoreValue('${v._id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn-danger" onclick="deleteCoreValue('${v._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        showToast('Failed to load core values: ' + e.message, true);
        console.error(e);
    }
}

function openCoreValueModal(data = null) {
    const isEdit = !!data;
    document.getElementById('coreValueModalTitle').innerHTML =
        `<i class="fas fa-gem"></i> ${isEdit ? 'Edit Core Value' : 'Add Core Value'}`;
    document.getElementById('coreValueId').value = data?._id || '';
    document.getElementById('cvTitle').value = data?.title || '';
    document.getElementById('cvDescription').value = data?.description || '';
    document.getElementById('cvIconBgColor').value = data?.iconBgColor || 'bg-amber-100';
    document.getElementById('cvOrder').value = data?.order ?? 0;
    cvIconHidden.value = data?.icon || '';
    if (data?.icon) {
        cvIconPreview.src = data.icon;
        cvIconPreview.classList.add('show');
    } else {
        cvIconPreview.src = '';
        cvIconPreview.classList.remove('show');
    }
    cvIconUploadStatus.textContent = '';
    cvIconUploadStatus.className = 'image-upload-status';
    cvIconFileInput.value = '';
    const isActive = data?.isActive !== undefined ? data.isActive : true;
    const toggle = document.getElementById('coreValueActiveToggle');
    const hidden = document.getElementById('cvIsActive');
    const label = document.getElementById('coreValueActiveLabel');
    if (isActive) {
        toggle.classList.add('active');
        hidden.value = 'true';
        label.textContent = 'Yes, visible on site';
    } else {
        toggle.classList.remove('active');
        hidden.value = 'false';
        label.textContent = 'No, hidden';
    }
    openModal('coreValueModal');
}

async function editCoreValue(id) {
    try {
        const res = await apiFetch('/api/core-values/' + id);
        if (!res.ok) throw new Error('Core value not found');
        const json = await safeJson(res);
        openCoreValueModal(json.data || json);
    } catch (e) {
        showToast('Error loading core value: ' + e.message, true);
        console.error(e);
    }
}

document.getElementById('coreValueForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('coreValueId').value;
    const saveBtn = document.getElementById('coreValueSaveBtn');
    if (!id && !cvIconHidden.value) {
        cvIconUploadStatus.textContent = 'Please upload an icon image before saving.';
        cvIconUploadStatus.className = 'image-upload-status error';
        return;
    }
    const payload = {
        title: document.getElementById('cvTitle').value.trim(),
        description: document.getElementById('cvDescription').value.trim(),
        icon: cvIconHidden.value.trim(),
        iconBgColor: document.getElementById('cvIconBgColor').value.trim() || 'bg-amber-100',
        order: parseInt(document.getElementById('cvOrder').value, 10) || 0,
        isActive: document.getElementById('cvIsActive').value === 'true',
    };
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    try {
        let res;
        if (id) {
            res = await apiFetch('/api/core-values/' + id, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            res = await apiFetch('/api/core-values', { method: 'POST', body: JSON.stringify(payload) });
        }
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to save core value');
        }
        showToast(id ? 'Core value updated' : 'Core value created');
        closeModal('coreValueModal');
        loadCoreValues();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving core value: ' + e.message, true);
        console.error(e);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Core Value';
    }
});

async function deleteCoreValue(id) {
    if (!confirm('Delete this core value?')) return;
    try {
        const res = await apiFetch('/api/core-values/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Core value deleted');
        loadCoreValues();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting core value: ' + e.message, true);
        console.error(e);
    }
}

window.openCoreValueModal = openCoreValueModal;
window.editCoreValue = editCoreValue;
window.deleteCoreValue = deleteCoreValue;
window.toggleCoreValueActive = toggleCoreValueActive;
