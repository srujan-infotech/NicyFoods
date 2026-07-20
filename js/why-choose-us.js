// ============================================================
//  Why Choose Us page logic
// ============================================================

const FALLBACK_WHY_CHOOSE_US = [
    { _id: 'fallback-1', title: 'Trusted Since 2017', description: 'Over 6+ years of experience and thousands of satisfied customers who trust us for their family\'s health.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><path d="M18 6l3-3"/></svg>',
        gradientFrom: 'from-rose-400', gradientTo: 'to-pink-500', highlighted: false, order: 1,
        isActive: true },
    { _id: 'fallback-2', title: 'Handmade Excellence', description: 'Every batch is prepared in-house with careful attention to detail, ensuring consistent quality and taste.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V10l6-4 6 4v11"/><path d="M15 21v-7l6-3v10"/><path d="M7 14h.01"/><path d="M7 17h.01"/><path d="M11 14h.01"/><path d="M11 17h.01"/></svg>',
        gradientFrom: 'from-slate-400', gradientTo: 'to-slate-500', highlighted: false, order: 2,
        isActive: true },
    { _id: 'fallback-3', title: 'Fresh Delivery', description: 'Products are prepared and delivered fresh to ensure maximum nutritional value and authentic taste.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8L12 3 3 8"/><path d="M3 8v8l9 5 9-5V8"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/></svg>',
        gradientFrom: 'from-amber-500', gradientTo: 'to-orange-600', highlighted: false, order: 3,
        isActive: true },
    { _id: 'fallback-4', title: '100% Satisfaction', description: 'We stand behind every product. Your satisfaction and your family\'s health are our top priorities.',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>',
        gradientFrom: 'from-pink-500', gradientTo: 'to-rose-600', highlighted: false, order: 4,
        isActive: true }
];
let fallbackShown = false;

(function init() {
    const user = initAdminShell('whyChooseUs');
    if (!user) return;
    loadWhyChooseUs();
})();

function toggleWcuActive() {
    const toggle = document.getElementById('wcuActiveToggle');
    const hidden = document.getElementById('wcuIsActive');
    const label = document.getElementById('wcuActiveLabel');
    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';
}

function toggleWcuHighlighted() {
    const toggle = document.getElementById('wcuHighlightedToggle');
    const hidden = document.getElementById('wcuHighlighted');
    const label = document.getElementById('wcuHighlightedLabel');
    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes (highlighted)' : 'No (normal card)';
}

// ---------- ICON URL RESOLUTION ----------
// Icons can be stored as: a full http(s) URL, an inline <svg>, or a
// relative path like "/uploads/why-choose-us/xyz.png" returned by the
// upload endpoint. getImageUrl() (admin-common.js) normalizes the
// relative-path case into an absolute URL against API_BASE_URL.
function resolveWcuIcon(icon) {
    if (!icon) return '';
    const trimmed = icon.trim();
    if (trimmed.startsWith('<svg')) return trimmed; // inline SVG, nothing to resolve
    return getImageUrl(trimmed) || trimmed;
}

function renderWcuIconCell(item) {
    const gradient = `bg-gradient-to-br ${item.gradientFrom || 'from-rose-400'} ${item.gradientTo || 'to-pink-500'}`;
    const resolved = resolveWcuIcon(item.icon);
    if (!resolved) {
        return `<div class="qp-icon-preview ${gradient}"><i class="fas fa-question-circle"></i></div>`;
    }
    if (resolved.startsWith('<svg')) {
        return `<div class="qp-icon-preview ${gradient}">${resolved}</div>`;
    }
    return `<div class="qp-icon-preview ${gradient}"><img src="${resolved}" alt="${item.title}" onerror="this.style.display='none';this.parentElement.innerHTML='<i class=\\'fas fa-question-circle\\'></i>';" /></div>`;
}

async function loadWhyChooseUs() {
    const tbody = document.getElementById('whyChooseUsTableBody');
    try {
        const res = await apiFetch('/api/why-choose-us');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = (json.data || json).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-question-circle"></i> No items found</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(item => `
                    <tr>
                        <td>${renderWcuIconCell(item)}</td>
                        <td class="font-medium">${item.title}</td>
                        <td class="max-w-xs truncate">${item.description || ''}</td>
                        <td>${item.order ?? 0}</td>
                        <td>${item.highlighted ? '<span class="badge-status" style="background:#fef3c7;color:#854d0e;">Featured</span>' : ''}</td>
                        <td><span class="status-badge ${item.isActive ? 'active' : 'inactive'}">${item.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="editWhyChooseUs('${item._id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn-danger" onclick="deleteWhyChooseUs('${item._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        console.warn('Why Choose Us API unavailable – using fallback data.', e);
        const fallbackData = FALLBACK_WHY_CHOOSE_US.map(item => ({ ...item, _id: item._id || 'fallback-' + Date.now() + Math.random() }));
        tbody.innerHTML = fallbackData.map(item => `
                    <tr>
                        <td>${renderWcuIconCell(item)}</td>
                        <td class="font-medium">${item.title}</td>
                        <td class="max-w-xs truncate">${item.description || ''}</td>
                        <td>${item.order ?? 0}</td>
                        <td>${item.highlighted ? '<span class="badge-status" style="background:#fef3c7;color:#854d0e;">Featured</span>' : ''}</td>
                        <td><span class="status-badge ${item.isActive ? 'active' : 'inactive'}">${item.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                        <span class="text-xs text-slate-400 italic">(fallback – API unavailable)</span>
                        </td>
                    </tr>
                `).join('');
        if (!fallbackShown) {
            fallbackShown = true;
            showToast('⚠️ Why Choose Us: using fallback data (API not available).', true);
        }
    }
}

const wcuIconFileInput2 = document.getElementById('wcuIconFile');
const wcuIconPreview2 = document.getElementById('wcuIconPreview');
const wcuIconUploadStatus2 = document.getElementById('wcuImageUploadStatus');
const wcuIconHidden2 = document.getElementById('wcuIcon');

wcuIconFileInput2.addEventListener('change', async () => {
    const file = wcuIconFileInput2.files[0];
    if (!file) return;
    const localPreviewUrl = URL.createObjectURL(file);
    wcuIconPreview2.src = localPreviewUrl;
    wcuIconPreview2.classList.add('show');
    wcuIconUploadStatus2.textContent = 'Uploading...';
    wcuIconUploadStatus2.className = 'image-upload-status uploading';
    try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadFetch(`${API_BASE_URL}/api/upload`, formData);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Upload failed');

        // data.url may be a relative path like "/uploads/why-choose-us/xyz.png".
        // Store the ABSOLUTE url so it renders correctly everywhere, including
        // on about.html which lives on a different domain than the API.
        const absoluteUrl = getImageUrl(data.url) || data.url;
        wcuIconHidden2.value = absoluteUrl;

        // Swap the preview from the local blob to the real uploaded URL so
        // what you see in the form matches what will actually be saved.
        wcuIconPreview2.src = absoluteUrl;

        wcuIconUploadStatus2.textContent = 'Icon uploaded ✓';
        wcuIconUploadStatus2.className = 'image-upload-status success';
    } catch (e) {
        console.error(e);
        wcuIconUploadStatus2.textContent = e instanceof TypeError ?
            "Can't reach the server. Check backend & API_BASE_URL." :
            "Couldn't upload icon. Please try again.";
        wcuIconUploadStatus2.className = 'image-upload-status error';
        wcuIconHidden2.value = '';
    }
});

function openWhyChooseUsModal(data = null) {
    const isEdit = !!data;
    document.getElementById('whyChooseUsModalTitle').innerHTML =
        `<i class="fas fa-question-circle"></i> ${isEdit ? 'Edit Why Choose Us Item' : 'Add Why Choose Us Item'}`;
    document.getElementById('whyChooseUsId').value = data?._id || '';
    document.getElementById('wcuTitle').value = data?.title || '';
    document.getElementById('wcuDescription').value = data?.description || '';
    document.getElementById('wcuGradientFrom').value = data?.gradientFrom || 'from-rose-400';
    document.getElementById('wcuGradientTo').value = data?.gradientTo || 'to-pink-500';
    document.getElementById('wcuOrder').value = data?.order ?? 0;

    const resolvedIcon = resolveWcuIcon(data?.icon);
    wcuIconHidden2.value = data?.icon || '';
    if (resolvedIcon && !resolvedIcon.startsWith('<svg')) {
        wcuIconPreview2.src = resolvedIcon;
        wcuIconPreview2.classList.add('show');
    } else {
        wcuIconPreview2.src = '';
        wcuIconPreview2.classList.remove('show');
    }
    wcuIconUploadStatus2.textContent = '';
    wcuIconUploadStatus2.className = 'image-upload-status';
    wcuIconFileInput2.value = '';
    const highlighted = data?.highlighted || false;
    const toggle = document.getElementById('wcuHighlightedToggle');
    const hidden = document.getElementById('wcuHighlighted');
    const label = document.getElementById('wcuHighlightedLabel');
    if (highlighted) {
        toggle.classList.add('active');
        hidden.value = 'true';
        label.textContent = 'Yes (highlighted)';
    } else {
        toggle.classList.remove('active');
        hidden.value = 'false';
        label.textContent = 'No (normal card)';
    }
    const isActive = data?.isActive !== undefined ? data.isActive : true;
    const activeToggle = document.getElementById('wcuActiveToggle');
    const activeHidden = document.getElementById('wcuIsActive');
    const activeLabel = document.getElementById('wcuActiveLabel');
    if (isActive) {
        activeToggle.classList.add('active');
        activeHidden.value = 'true';
        activeLabel.textContent = 'Yes, visible on site';
    } else {
        activeToggle.classList.remove('active');
        activeHidden.value = 'false';
        activeLabel.textContent = 'No, hidden';
    }
    openModal('whyChooseUsModal');
}

async function editWhyChooseUs(id) {
    try {
        const res = await apiFetch('/api/why-choose-us/' + id);
        if (!res.ok) throw new Error('Item not found');
        const json = await safeJson(res);
        openWhyChooseUsModal(json.data || json);
    } catch (e) {
        showToast('Error loading item: ' + e.message, true);
        console.error(e);
    }
}

document.getElementById('whyChooseUsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('whyChooseUsId').value;
    const saveBtn = document.getElementById('wcuSaveBtn');
    if (!id && !wcuIconHidden2.value) {
        wcuIconUploadStatus2.textContent = 'Please upload an icon image before saving.';
        wcuIconUploadStatus2.className = 'image-upload-status error';
        return;
    }
    const payload = {
        title: document.getElementById('wcuTitle').value.trim(),
        description: document.getElementById('wcuDescription').value.trim(),
        icon: wcuIconHidden2.value.trim(),
        gradientFrom: document.getElementById('wcuGradientFrom').value.trim() || 'from-rose-400',
        gradientTo: document.getElementById('wcuGradientTo').value.trim() || 'to-pink-500',
        highlighted: document.getElementById('wcuHighlighted').value === 'true',
        order: parseInt(document.getElementById('wcuOrder').value, 10) || 0,
        isActive: document.getElementById('wcuIsActive').value === 'true',
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
            res = await apiFetch('/api/why-choose-us/' + id, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            res = await apiFetch('/api/why-choose-us', { method: 'POST', body: JSON.stringify(payload) });
        }
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to save item');
        }
        showToast(id ? 'Item updated' : 'Item created');
        closeModal('whyChooseUsModal');
        loadWhyChooseUs();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving item: ' + e.message, true);
        console.error(e);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Item';
    }
});

async function deleteWhyChooseUs(id) {
    if (!confirm('Delete this item?')) return;
    try {
        const res = await apiFetch('/api/why-choose-us/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Item deleted');
        loadWhyChooseUs();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting item: ' + e.message, true);
        console.error(e);
    }
}

window.openWhyChooseUsModal = openWhyChooseUsModal;
window.editWhyChooseUs = editWhyChooseUs;
window.deleteWhyChooseUs = deleteWhyChooseUs;
window.toggleWcuActive = toggleWcuActive;
window.toggleWcuHighlighted = toggleWcuHighlighted;