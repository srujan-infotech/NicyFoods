// // ============================================================
// //  Companies page logic
// // ============================================================

// (function init() {
//     const user = initAdminShell('companies');
//     if (!user) return;
//     loadCompanies();
// })();

// const companyImageFileInput = document.getElementById('cLogoFile');
// const companyImagePreview = document.getElementById('cLogoPreview');
// const companyImageUploadStatus = document.getElementById('companyImageUploadStatus');

// companyImageFileInput.addEventListener('change', () => {
//     const file = companyImageFileInput.files[0];
//     if (!file) return;
//     const localPreviewUrl = URL.createObjectURL(file);
//     companyImagePreview.src = localPreviewUrl;
//     companyImagePreview.classList.add('show');
//     companyImageUploadStatus.textContent = 'Logo selected ✓';
//     companyImageUploadStatus.className = 'image-upload-status success';
// });

// function toggleCompanyActive() {
//     const toggle = document.getElementById('companyActiveToggle');
//     const hidden = document.getElementById('cIsActive');
//     const label = document.getElementById('companyActiveLabel');
//     const isActive = toggle.classList.toggle('active');
//     hidden.value = isActive ? 'true' : 'false';
//     label.textContent = isActive ? 'Yes, visible on site' : 'No, hidden';
// }

// async function loadCompanies() {
//     try {
//         const res = await apiFetch('/api/companies');
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const json = await safeJson(res);
//         const data = json.data || json;
//         const tbody = document.getElementById('companiesTableBody');
//         if (!data.length) {
//             tbody.innerHTML =
//                 `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-building"></i> No companies found</div></td></tr>`;
//             return;
//         }
//         tbody.innerHTML = data.map(c => `
//                     <tr>
//                         <td>${c.logo ? `<img src="${getImageUrl(c.logo, 'companies')}" alt="${c.altText || c.name}" class="product-thumb" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'product-thumb-placeholder\\'><i class=\\'fas fa-image\\'></i></div>';" />` : '<div class="product-thumb-placeholder"><i class="fas fa-image"></i></div>'}</td>
//                         <td class="font-medium">${c.name}</td>
//                         <td class="max-w-xs truncate">${c.altText || ''}</td>
//                         <td>${c.order ?? 0}</td>
//                         <td><span class="status-badge ${c.isActive ? 'active' : 'inactive'}">${c.isActive ? 'Active' : 'Inactive'}</span></td>
//                         <td>
//                         <div class="actions-cell">
//                             <button class="btn-edit" onclick="editCompany('${c._id}')"><i class="fas fa-edit"></i></button>
//                             <button class="btn-danger" onclick="deleteCompany('${c._id}')"><i class="fas fa-trash-alt"></i></button>
//                         </div>
//                         </td>
//                     </tr>
//                 `).join('');
//     } catch (e) {
//         showToast('Failed to load companies: ' + e.message, true);
//         console.error(e);
//     }
// }

// function openCompanyModal(data = null) {
//     const isEdit = !!data;
//     document.getElementById('companyModalTitle').innerHTML =
//         `<i class="fas fa-building"></i> ${isEdit ? 'Edit Company' : 'Add Company'}`;
//     document.getElementById('companyId').value = data?._id || '';
//     document.getElementById('cName').value = data?.name || '';
//     document.getElementById('cAltText').value = data?.altText || '';
//     document.getElementById('cOrder').value = data?.order ?? 0;
//     const isActive = data?.isActive !== undefined ? data.isActive : true;
//     const toggle = document.getElementById('companyActiveToggle');
//     const hidden = document.getElementById('cIsActive');
//     const label = document.getElementById('companyActiveLabel');
//     if (isActive) {
//         toggle.classList.add('active');
//         hidden.value = 'true';
//         label.textContent = 'Yes, visible on site';
//     } else {
//         toggle.classList.remove('active');
//         hidden.value = 'false';
//         label.textContent = 'No, hidden';
//     }
//     if (data?.logo) {
//         companyImagePreview.src = getImageUrl(data.logo, 'companies');
//         companyImagePreview.classList.add('show');
//     } else {
//         companyImagePreview.src = '';
//         companyImagePreview.classList.remove('show');
//     }
//     companyImageUploadStatus.textContent = '';
//     companyImageUploadStatus.className = 'image-upload-status';
//     companyImageFileInput.value = '';
//     openModal('companyModal');
// }

// async function editCompany(id) {
//     try {
//         const res = await apiFetch('/api/companies/' + id);
//         if (!res.ok) throw new Error('Company not found');
//         const json = await safeJson(res);
//         openCompanyModal(json.data || json);
//     } catch (e) {
//         showToast('Error loading company: ' + e.message, true);
//         console.error(e);
//     }
// }

// document.getElementById('companyForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const id = document.getElementById('companyId').value;
//     const saveBtn = document.getElementById('companySaveBtn');
//     const file = companyImageFileInput.files[0];
//     if (!id && !file) {
//         companyImageUploadStatus.textContent = 'Please select a logo image before saving.';
//         companyImageUploadStatus.className = 'image-upload-status error';
//         return;
//     }
//     saveBtn.disabled = true;
//     saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
//     try {
//         const formData = new FormData();
//         formData.append('name', document.getElementById('cName').value.trim());
//         formData.append('altText', document.getElementById('cAltText').value.trim());
//         formData.append('order', document.getElementById('cOrder').value || 0);
//         formData.append('isActive', document.getElementById('cIsActive').value === 'true');
//         if (file) formData.append('logo', file);

//         const token = getAuthToken();
//         const path = id ? `${API_BASE_URL}/api/companies/${id}` : `${API_BASE_URL}/api/companies`;
//         const res = await fetch(path, {
//             method: id ? 'PUT' : 'POST',
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//             body: formData,
//         });
//         const json = await res.json().catch(() => ({}));
//         if (!res.ok || json.success === false) {
//             throw new Error(json.message || 'Failed to save company');
//         }
//         showToast(id ? 'Company updated' : 'Company created');
//         closeModal('companyModal');
//         loadCompanies();
//         loadNavCounts();
//     } catch (e) {
//         showToast('Error saving company: ' + e.message, true);
//         console.error(e);
//     } finally {
//         saveBtn.disabled = false;
//         saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Company';
//     }
// });

// async function deleteCompany(id) {
//     if (!confirm('Delete this company?')) return;
//     try {
//         const res = await apiFetch('/api/companies/' + id, { method: 'DELETE' });
//         if (!res.ok) throw new Error('Delete failed');
//         showToast('Company deleted');
//         loadCompanies();
//         loadNavCounts();
//     } catch (e) {
//         showToast('Error deleting company: ' + e.message, true);
//         console.error(e);
//     }
// }

// window.openCompanyModal = openCompanyModal;
// window.editCompany = editCompany;
// window.deleteCompany = deleteCompany;
// window.toggleCompanyActive = toggleCompanyActive;







// ============================================================
// Companies page logic
// ============================================================

(function init() {
    // Wait until DOM is ready before accessing elements
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCompaniesPage);
    } else {
        initCompaniesPage();
    }
})();

function initCompaniesPage() {
    try {
        const user = initAdminShell('companies');
        if (!user) return;

        setupCompanyImageUpload();
        setupCompanyForm();

        loadCompanies();
    } catch (error) {
        console.error('Companies page initialization error:', error);
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
// Company image upload
// ============================================================

let companyImageFileInput = null;
let companyImagePreview = null;
let companyImageUploadStatus = null;

function setupCompanyImageUpload() {
    companyImageFileInput = getElement('cLogoFile');
    companyImagePreview = getElement('cLogoPreview');
    companyImageUploadStatus = getElement('companyImageUploadStatus');

    if (!companyImageFileInput) return;

    companyImageFileInput.addEventListener('change', () => {
        const file = companyImageFileInput.files?.[0];

        if (!file) return;

        // Optional image validation
        if (!file.type.startsWith('image/')) {
            companyImageFileInput.value = '';

            if (companyImageUploadStatus) {
                companyImageUploadStatus.textContent =
                    'Please select a valid image file.';
                companyImageUploadStatus.className =
                    'image-upload-status error';
            }

            return;
        }

        const localPreviewUrl = URL.createObjectURL(file);

        if (companyImagePreview) {
            companyImagePreview.src = localPreviewUrl;
            companyImagePreview.classList.add('show');
        }

        if (companyImageUploadStatus) {
            companyImageUploadStatus.textContent = 'Logo selected ✓';
            companyImageUploadStatus.className =
                'image-upload-status success';
        }
    });
}

// ============================================================
// Active toggle
// ============================================================

function toggleCompanyActive() {
    const toggle = getElement('companyActiveToggle');
    const hidden = getElement('cIsActive');
    const label = getElement('companyActiveLabel');

    if (!toggle || !hidden || !label) return;

    const isActive = toggle.classList.toggle('active');

    hidden.value = isActive ? 'true' : 'false';

    label.textContent = isActive
        ? 'Yes, visible on site'
        : 'No, hidden';
}

// ============================================================
// Load companies
// ============================================================

async function loadCompanies() {
    try {
        const res = await apiFetch('/api/companies');

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const json = await safeJson(res);

        // Support different API response formats
        let data = [];

        if (Array.isArray(json)) {
            data = json;
        } else if (Array.isArray(json?.data)) {
            data = json.data;
        } else if (Array.isArray(json?.companies)) {
            data = json.companies;
        } else if (Array.isArray(json?.data?.companies)) {
            data = json.data.companies;
        }

        const tbody = getElement('companiesTableBody');

        if (!tbody) return;

        // Empty state
        if (!data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <i class="fas fa-building"></i>
                            No companies found
                        </div>
                    </td>
                </tr>
            `;

            return;
        }

        tbody.innerHTML = data.map(company => {
            const id = escapeHtml(company._id || '');
            const name = escapeHtml(company.name || '');
            const altText = escapeHtml(company.altText || '');
            const order = company.order ?? 0;

            const isActive =
                company.isActive === true ||
                company.isActive === 'true';

            const logoHtml = company.logo
                ? `
                    <img
                        src="${escapeHtml(
                            getImageUrl(company.logo, 'companies')
                        )}"
                        alt="${altText || name}"
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
                    <td>
                        ${logoHtml}
                    </td>

                    <td class="font-medium">
                        ${name}
                    </td>

                    <td class="max-w-xs truncate">
                        ${altText}
                    </td>

                    <td>
                        ${escapeHtml(order)}
                    </td>

                    <td>
                        <span class="status-badge ${isActive ? 'active' : 'inactive'}">
                            ${isActive ? 'Active' : 'Inactive'}
                        </span>
                    </td>

                    <td>
                        <div class="actions-cell">

                            <button
                                type="button"
                                class="btn-edit"
                                onclick="editCompany('${id}')"
                                title="Edit Company"
                            >
                                <i class="fas fa-edit"></i>
                            </button>

                            <button
                                type="button"
                                class="btn-danger"
                                onclick="deleteCompany('${id}')"
                                title="Delete Company"
                            >
                                <i class="fas fa-trash-alt"></i>
                            </button>

                        </div>
                    </td>
                </tr>
            `;
        }).join('');

    } catch (error) {
        showToast(
            'Failed to load companies: ' + error.message,
            true
        );

        console.error('loadCompanies error:', error);
    }
}

// ============================================================
// Open company modal
// ============================================================

function openCompanyModal(data = null) {
    const isEdit = !!data;

    const title = getElement('companyModalTitle');
    const companyId = getElement('companyId');
    const name = getElement('cName');
    const altText = getElement('cAltText');
    const order = getElement('cOrder');

    const toggle = getElement('companyActiveToggle');
    const hidden = getElement('cIsActive');
    const label = getElement('companyActiveLabel');

    if (title) {
        title.innerHTML = `
            <i class="fas fa-building"></i>
            ${isEdit ? 'Edit Company' : 'Add Company'}
        `;
    }

    if (companyId) {
        companyId.value = data?._id || '';
    }

    if (name) {
        name.value = data?.name || '';
    }

    if (altText) {
        altText.value = data?.altText || '';
    }

    if (order) {
        order.value = data?.order ?? 0;
    }

    // Active state
    const isActive =
        data?.isActive === undefined
            ? true
            : (
                data.isActive === true ||
                data.isActive === 'true'
            );

    if (toggle) {
        toggle.classList.toggle('active', isActive);
    }

    if (hidden) {
        hidden.value = isActive ? 'true' : 'false';
    }

    if (label) {
        label.textContent = isActive
            ? 'Yes, visible on site'
            : 'No, hidden';
    }

    // Logo preview
    if (companyImagePreview) {
        if (data?.logo) {
            companyImagePreview.src =
                getImageUrl(data.logo, 'companies');

            companyImagePreview.classList.add('show');
        } else {
            companyImagePreview.src = '';
            companyImagePreview.classList.remove('show');
        }
    }

    // Reset file input
    if (companyImageFileInput) {
        companyImageFileInput.value = '';
    }

    if (companyImageUploadStatus) {
        companyImageUploadStatus.textContent = '';
        companyImageUploadStatus.className =
            'image-upload-status';
    }

    openModal('companyModal');
}

// ============================================================
// Edit company
// ============================================================

async function editCompany(id) {
    if (!id) {
        showToast('Invalid company ID', true);
        return;
    }

    try {
        const res = await apiFetch(
            '/api/companies/' + encodeURIComponent(id)
        );

        if (!res.ok) {
            throw new Error(
                `Company not found (HTTP ${res.status})`
            );
        }

        const json = await safeJson(res);

        const company =
            json?.data ||
            json?.company ||
            json;

        if (!company) {
            throw new Error('Invalid company data');
        }

        openCompanyModal(company);

    } catch (error) {
        showToast(
            'Error loading company: ' + error.message,
            true
        );

        console.error('editCompany error:', error);
    }
}

// ============================================================
// Company form
// ============================================================

function setupCompanyForm() {
    const form = getElement('companyForm');

    if (!form) return;

    form.addEventListener('submit', handleCompanySubmit);
}

async function handleCompanySubmit(e) {
    e.preventDefault();

    const idElement = getElement('companyId');
    const nameElement = getElement('cName');
    const altTextElement = getElement('cAltText');
    const orderElement = getElement('cOrder');
    const activeElement = getElement('cIsActive');
    const saveBtn = getElement('companySaveBtn');

    const id = idElement?.value?.trim() || '';

    const file = companyImageFileInput?.files?.[0];

    // Required fields
    const name = nameElement?.value?.trim() || '';
    const altText = altTextElement?.value?.trim() || '';
    const order = orderElement?.value || '0';

    // New company requires logo
    if (!id && !file) {
        if (companyImageUploadStatus) {
            companyImageUploadStatus.textContent =
                'Please select a logo image before saving.';

            companyImageUploadStatus.className =
                'image-upload-status error';
        }

        return;
    }

    // Name validation
    if (!name) {
        showToast('Company name is required.', true);
        nameElement?.focus();
        return;
    }

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            Saving...
        `;
    }

    try {
        const formData = new FormData();

        formData.append('name', name);
        formData.append('altText', altText);
        formData.append('order', order);

        formData.append(
            'isActive',
            activeElement?.value === 'true'
        );

        if (file) {
            formData.append('logo', file);
        }

        const token = getAuthToken();

        const path = id
            ? `${API_BASE_URL}/api/companies/${encodeURIComponent(id)}`
            : `${API_BASE_URL}/api/companies`;

        const res = await fetch(path, {
            method: id ? 'PUT' : 'POST',

            headers: token
                ? {
                    Authorization: `Bearer ${token}`
                }
                : {},

            body: formData
        });

        const json = await res.json().catch(() => ({}));

        if (!res.ok || json.success === false) {
            throw new Error(
                json.message ||
                json.error ||
                `Failed to save company (HTTP ${res.status})`
            );
        }

        showToast(
            id
                ? 'Company updated successfully'
                : 'Company created successfully'
        );

        closeModal('companyModal');

        await loadCompanies();

        if (typeof loadNavCounts === 'function') {
            loadNavCounts();
        }

    } catch (error) {
        showToast(
            'Error saving company: ' + error.message,
            true
        );

        console.error('handleCompanySubmit error:', error);

    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;

            saveBtn.innerHTML = `
                <i class="fas fa-save"></i>
                Save Company
            `;
        }
    }
}

// ============================================================
// Delete company
// ============================================================

async function deleteCompany(id) {
    if (!id) {
        showToast('Invalid company ID', true);
        return;
    }

    const confirmed = confirm(
        'Are you sure you want to delete this company?'
    );

    if (!confirmed) return;

    try {
        const res = await apiFetch(
            '/api/companies/' + encodeURIComponent(id),
            {
                method: 'DELETE'
            }
        );

        if (!res.ok) {
            const json = await safeJson(res).catch(() => ({}));

            throw new Error(
                json?.message ||
                `Delete failed (HTTP ${res.status})`
            );
        }

        showToast('Company deleted successfully');

        await loadCompanies();

        if (typeof loadNavCounts === 'function') {
            loadNavCounts();
        }

    } catch (error) {
        showToast(
            'Error deleting company: ' + error.message,
            true
        );

        console.error('deleteCompany error:', error);
    }
}

// ============================================================
// Make functions available to inline HTML onclick handlers
// ============================================================

window.openCompanyModal = openCompanyModal;
window.editCompany = editCompany;
window.deleteCompany = deleteCompany;
window.toggleCompanyActive = toggleCompanyActive;