// ============================================================
// Gallery (admin) page logic — "A Glimpse Of Our Ladoos" images
// ============================================================

(function init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGalleryPage);
    } else {
        initGalleryPage();
    }
})();

function initGalleryPage() {
    try {
        const user = initAdminShell('gallery');
        if (!user) return;

        setupGalleryImageUpload();
        setupGalleryForm();

        loadGalleryImages();
    } catch (error) {
        console.error('Gallery page initialization error:', error);
    }
}

// ============================================================
// Helpers
// ============================================================

function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element #${id} was not found.`);
    }
    return element;
}

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================================
// Gallery image upload (preview)
// ============================================================

let galleryImageFileInput = null;
let galleryImagePreview = null;
let galleryImageUploadStatus = null;

function setupGalleryImageUpload() {
    galleryImageFileInput = getElement('gImageFile');
    galleryImagePreview = getElement('gImagePreview');
    galleryImageUploadStatus = getElement('galleryImageUploadStatus');

    if (!galleryImageFileInput) return;

    galleryImageFileInput.addEventListener('change', () => {
        const file = galleryImageFileInput.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            galleryImageFileInput.value = '';
            if (galleryImageUploadStatus) {
                galleryImageUploadStatus.textContent = 'Please select a valid image file.';
                galleryImageUploadStatus.className = 'image-upload-status error';
            }
            return;
        }

        const localPreviewUrl = URL.createObjectURL(file);
        if (galleryImagePreview) {
            galleryImagePreview.src = localPreviewUrl;
            galleryImagePreview.classList.add('show');
        }
        if (galleryImageUploadStatus) {
            galleryImageUploadStatus.textContent = 'Image selected ✓';
            galleryImageUploadStatus.className = 'image-upload-status success';
        }
    });
}

// ============================================================
// Active toggle
// ============================================================

function toggleGalleryActive() {
    const toggle = getElement('galleryActiveToggle');
    const hidden = getElement('gIsActive');
    const label = getElement('galleryActiveLabel');
    if (!toggle || !hidden || !label) return;

    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';
}

// ============================================================
// Load gallery images (admin table — includes inactive too)
// ============================================================

async function loadGalleryImages() {
    try {
        const res = await apiFetch('/api/gallery/all');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);

        let data = [];
        if (Array.isArray(json)) data = json;
        else if (Array.isArray(json?.data)) data = json.data;

        const tbody = getElement('galleryTableBody');
        if (!tbody) return;

        if (!data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">
                        <div class="empty-state">
                            <i class="fas fa-images"></i>
                            No gallery images yet
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(item => {
            const id = escapeHtml(item._id || '');
            const title = escapeHtml(item.title || '');
            const alt = escapeHtml(item.alt || '');
            const order = item.order ?? 0;
            const size = item.size === 'large' ? 'Large' : 'Normal';
            const isActive = item.isActive === true || item.isActive === 'true';

            const imageHtml = item.image
                ? `
                    <img
                        src="${escapeHtml(getImageUrl(item.image, 'gallery'))}"
                        alt="${alt || title}"
                        class="product-thumb"
                        onerror="
                            this.style.display='none';
                            this.parentElement.innerHTML=
                            '<div class=&quot;product-thumb-placeholder&quot;>' +
                            '<i class=&quot;fas fa-image&quot;></i>' +
                            '</div>';
                        "
                    />
                `
                : `
                    <div class="product-thumb-placeholder">
                        <i class="fas fa-image"></i>
                    </div>
                `;

            return `
                <tr>
                    <td>${imageHtml}</td>
                    <td class="font-medium">${title || '<span class="text-slate-400">—</span>'}</td>
                    <td class="max-w-xs truncate">${alt}</td>
                    <td>${size}</td>
                    <td>${escapeHtml(order)}</td>
                    <td>
                        <span class="status-badge ${isActive ? 'active' : 'inactive'}">
                            ${isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>
                    <td>
                        <div class="actions-cell">
                            <button type="button" class="btn-edit" onclick="editGalleryImage('${id}')" title="Edit Image">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn-danger" onclick="deleteGalleryImage('${id}')" title="Delete Image">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        showToast('Failed to load gallery images: ' + error.message, true);
        console.error('loadGalleryImages error:', error);
    }
}

// ============================================================
// Open gallery modal
// ============================================================

function openGalleryModal(data = null) {
    const isEdit = !!data;

    const title = getElement('galleryModalTitle');
    const galleryId = getElement('galleryId');
    const gTitle = getElement('gTitle');
    const altText = getElement('gAltText');
    const order = getElement('gOrder');
    const size = getElement('gSize');

    const toggle = getElement('galleryActiveToggle');
    const hidden = getElement('gIsActive');
    const label = getElement('galleryActiveLabel');

    if (title) {
        title.innerHTML = `<i class="fas fa-images"></i> ${isEdit ? 'Edit Image' : 'Add Image'}`;
    }
    if (galleryId) galleryId.value = data?._id || '';
    if (gTitle) gTitle.value = data?.title || '';
    if (altText) altText.value = data?.alt || '';
    if (order) order.value = data?.order ?? 0;
    if (size) size.value = data?.size || 'normal';

    const isActive = data?.isActive === undefined ? true : (data.isActive === true || data.isActive === 'true');
    if (toggle) toggle.classList.toggle('active', isActive);
    if (hidden) hidden.value = isActive ? 'true' : 'false';
    if (label) label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';

    if (galleryImagePreview) {
        if (data?.image) {
            galleryImagePreview.src = getImageUrl(data.image, 'gallery');
            galleryImagePreview.classList.add('show');
        } else {
            galleryImagePreview.src = '';
            galleryImagePreview.classList.remove('show');
        }
    }

    if (galleryImageFileInput) galleryImageFileInput.value = '';
    if (galleryImageUploadStatus) {
        galleryImageUploadStatus.textContent = '';
        galleryImageUploadStatus.className = 'image-upload-status';
    }

    openModal('galleryModal');
}

// ============================================================
// Edit gallery image
// ============================================================

async function editGalleryImage(id) {
    if (!id) {
        showToast('Invalid image ID', true);
        return;
    }

    try {
        const res = await apiFetch('/api/gallery/' + encodeURIComponent(id));
        if (!res.ok) throw new Error(`Image not found (HTTP ${res.status})`);
        const json = await safeJson(res);
        const image = json?.data || json;
        if (!image) throw new Error('Invalid gallery image data');
        openGalleryModal(image);
    } catch (error) {
        showToast('Error loading image: ' + error.message, true);
        console.error('editGalleryImage error:', error);
    }
}

// ============================================================
// Gallery form (create / update)
// ============================================================

function setupGalleryForm() {
    const form = getElement('galleryForm');
    if (!form) return;
    form.addEventListener('submit', handleGallerySubmit);
}

async function handleGallerySubmit(e) {
    e.preventDefault();

    const idElement = getElement('galleryId');
    const titleElement = getElement('gTitle');
    const altTextElement = getElement('gAltText');
    const orderElement = getElement('gOrder');
    const sizeElement = getElement('gSize');
    const activeElement = getElement('gIsActive');
    const saveBtn = getElement('gallerySaveBtn');

    const id = idElement?.value?.trim() || '';
    const file = galleryImageFileInput?.files?.[0];

    const titleVal = titleElement?.value?.trim() || '';
    const altText = altTextElement?.value?.trim() || '';
    const order = orderElement?.value || '0';
    const size = sizeElement?.value || 'normal';

    if (!id && !file) {
        if (galleryImageUploadStatus) {
            galleryImageUploadStatus.textContent = 'Please select an image before saving.';
            galleryImageUploadStatus.className = 'image-upload-status error';
        }
        return;
    }

    if (!altText) {
        showToast('Alt text is required.', true);
        altTextElement?.focus();
        return;
    }

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Saving...`;
    }

    try {
        const formData = new FormData();
        formData.append('title', titleVal);
        formData.append('alt', altText);
        formData.append('order', order);
        formData.append('size', size);
        formData.append('isActive', activeElement?.value === 'true');
        if (file) formData.append('image', file);

        const token = getAuthToken();
        const path = id
            ? `${API_BASE_URL}/api/gallery/${encodeURIComponent(id)}`
            : `${API_BASE_URL}/api/gallery`;

        const res = await fetch(path, {
            method: id ? 'PUT' : 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) {
            throw new Error(json.message || json.error || `Failed to save image (HTTP ${res.status})`);
        }

        showToast(id ? 'Gallery image updated successfully' : 'Gallery image added successfully');
        closeModal('galleryModal');
        await loadGalleryImages();

        if (typeof loadNavCounts === 'function') loadNavCounts();

    } catch (error) {
        showToast('Error saving image: ' + error.message, true);
        console.error('handleGallerySubmit error:', error);
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `<i class="fas fa-save"></i> Save Image`;
        }
    }
}

// ============================================================
// Delete gallery image
// ============================================================

async function deleteGalleryImage(id) {
    if (!id) {
        showToast('Invalid image ID', true);
        return;
    }

    const confirmed = confirm('Are you sure you want to delete this gallery image?');
    if (!confirmed) return;

    try {
        const res = await apiFetch('/api/gallery/' + encodeURIComponent(id), { method: 'DELETE' });
        if (!res.ok) {
            const json = await safeJson(res).catch(() => ({}));
            throw new Error(json?.message || `Delete failed (HTTP ${res.status})`);
        }

        showToast('Gallery image deleted successfully');
        await loadGalleryImages();

        if (typeof loadNavCounts === 'function') loadNavCounts();

    } catch (error) {
        showToast('Error deleting image: ' + error.message, true);
        console.error('deleteGalleryImage error:', error);
    }
}

// ============================================================
// Expose to inline HTML onclick handlers
// ============================================================

window.openGalleryModal = openGalleryModal;
window.editGalleryImage = editGalleryImage;
window.deleteGalleryImage = deleteGalleryImage;
window.toggleGalleryActive = toggleGalleryActive;
