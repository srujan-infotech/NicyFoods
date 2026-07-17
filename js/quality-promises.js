// ============================================================
//  Quality Promises page logic
// ============================================================

(function init() {
    const user = initAdminShell('qualityPromises');
    if (!user) return;
    loadQualityPromises();
})();

function toggleQualityPromiseActive() {
    const toggle = document.getElementById('qualityPromiseActiveToggle');
    const hidden = document.getElementById('qpIsActive');
    const label = document.getElementById('qualityPromiseActiveLabel');
    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';
}

function renderQualityPromiseIconCell(p) {
    const bg = p.iconBgColor || 'bg-emerald-400';
    return p.icon ?
        `<div class="qp-icon-preview ${bg}"><img src="${p.icon}" alt="${p.title}" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-shield-alt\\'></i>';" /></div>` :
        `<div class="qp-icon-preview ${bg}"><i class="fas fa-shield-alt"></i></div>`;
}

async function loadQualityPromises() {
    try {
        const res = await apiFetch('/api/quality-promise');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = (json.data || json).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const tbody = document.getElementById('qualityPromisesTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-shield-alt"></i> No quality promises found</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(p => `
                    <tr>
                        <td>${renderQualityPromiseIconCell(p)}</td>
                        <td class="font-medium">${p.title}</td>
                        <td class="max-w-xs truncate">${p.description || ''}</td>
                        <td>${p.order ?? 0}</td>
                        <td><span class="status-badge ${p.isActive ? 'active' : 'inactive'}">${p.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="editQualityPromise('${p._id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn-danger" onclick="deleteQualityPromise('${p._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        showToast('Failed to load quality promises: ' + e.message, true);
        console.error(e);
    }
}

const qpIconFileInput = document.getElementById('qpIconFile');
const qpIconPreview = document.getElementById('qpIconPreview');
const qpIconUploadStatus = document.getElementById('qpImageUploadStatus');
const qpIconHidden = document.getElementById('qpIcon');

qpIconFileInput.addEventListener('change', async () => {
    const file = qpIconFileInput.files[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    qpIconPreview.src = localPreviewUrl;
    qpIconPreview.classList.add('show');
    qpIconUploadStatus.textContent = 'Uploading...';
    qpIconUploadStatus.className = 'image-upload-status uploading';
    try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadFetch(`${API_BASE_URL}/api/upload`, formData);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed');
        qpIconHidden.value = data.url;
        qpIconUploadStatus.textContent = 'Icon uploaded ✓';
        qpIconUploadStatus.className = 'image-upload-status success';
    } catch (e) {
        console.error(e);
        qpIconUploadStatus.textContent = e instanceof TypeError ?
            "Can't reach the server. Check backend & API_BASE_URL." :
            "Couldn't upload icon. Please try again.";
        qpIconUploadStatus.className = 'image-upload-status error';
        qpIconHidden.value = '';
    }
});

function openQualityPromiseModal(data = null) {
    const isEdit = !!data;
    document.getElementById('qualityPromiseModalTitle').innerHTML =
        `<i class="fas fa-shield-alt"></i> ${isEdit ? 'Edit Quality Promise' : 'Add Quality Promise'}`;
    document.getElementById('qualityPromiseId').value = data?._id || '';
    document.getElementById('qpTitle').value = data?.title || '';
    document.getElementById('qpDescription').value = data?.description || '';
    document.getElementById('qpIconBgColor').value = data?.iconBgColor || 'bg-emerald-400';
    document.getElementById('qpOrder').value = data?.order ?? 0;
    qpIconHidden.value = data?.icon || '';
    if (data?.icon) {
        qpIconPreview.src = data.icon;
        qpIconPreview.classList.add('show');
    } else {
        qpIconPreview.src = '';
        qpIconPreview.classList.remove('show');
    }
    qpIconUploadStatus.textContent = '';
    qpIconUploadStatus.className = 'image-upload-status';
    qpIconFileInput.value = '';
    const isActive = data?.isActive !== undefined ? data.isActive : true;
    const toggle = document.getElementById('qualityPromiseActiveToggle');
    const hidden = document.getElementById('qpIsActive');
    const label = document.getElementById('qualityPromiseActiveLabel');
    if (isActive) {
        toggle.classList.add('active');
        hidden.value = 'true';
        label.textContent = 'Yes, visible on site';
    } else {
        toggle.classList.remove('active');
        hidden.value = 'false';
        label.textContent = 'No, hidden';
    }
    openModal('qualityPromiseModal');
}

async function editQualityPromise(id) {
    try {
        const res = await apiFetch('/api/quality-promise/' + id);
        if (!res.ok) throw new Error('Promise not found');
        const json = await safeJson(res);
        openQualityPromiseModal(json.data || json);
    } catch (e) {
        showToast('Error loading quality promise: ' + e.message, true);
        console.error(e);
    }
}

document.getElementById('qualityPromiseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('qualityPromiseId').value;
    const saveBtn = document.getElementById('qualityPromiseSaveBtn');
    if (!id && !qpIconHidden.value) {
        qpIconUploadStatus.textContent = 'Please upload an icon image before saving.';
        qpIconUploadStatus.className = 'image-upload-status error';
        return;
    }
    const payload = {
        title: document.getElementById('qpTitle').value.trim(),
        description: document.getElementById('qpDescription').value.trim(),
        icon: qpIconHidden.value.trim(),
        iconBgColor: document.getElementById('qpIconBgColor').value.trim() || 'bg-emerald-400',
        order: parseInt(document.getElementById('qpOrder').value, 10) || 0,
        isActive: document.getElementById('qpIsActive').value === 'true',
    };
    if (!payload.title || !payload.description) {
        showToast('Please fill in all required fields (title, description).', true);
        return;
    }
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    try {
        let res;
        if (id) {
            res = await apiFetch('/api/quality-promise/' + id, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            res = await apiFetch('/api/quality-promise', { method: 'POST', body: JSON.stringify(payload) });
        }
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to save quality promise');
        }
        showToast(id ? 'Quality promise updated' : 'Quality promise created');
        closeModal('qualityPromiseModal');
        loadQualityPromises();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving quality promise: ' + e.message, true);
        console.error(e);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Promise';
    }
});

async function deleteQualityPromise(id) {
    if (!confirm('Delete this quality promise?')) return;
    try {
        const res = await apiFetch('/api/quality-promise/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Quality promise deleted');
        loadQualityPromises();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting quality promise: ' + e.message, true);
        console.error(e);
    }
}

window.openQualityPromiseModal = openQualityPromiseModal;
window.editQualityPromise = editQualityPromise;
window.deleteQualityPromise = deleteQualityPromise;
window.toggleQualityPromiseActive = toggleQualityPromiseActive;
