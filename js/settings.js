// ============================================================
//  Site Settings page logic (phone / whatsapp / email / address / logo)
//  Same pattern as js/hero.js — server first, local fallback if the
//  /api/settings route isn't reachable yet.
// ============================================================

const DEFAULT_SETTINGS = {
    phone: '+91 8263001410',
    whatsapp: '918263001410',
    email: 'nicyfoods5@gmail.com',
    address: 'Plot No 20, Saikrupa Society, Ingale Nagar, Warje Jakat Naka, Warje, Pune – 411052',
    logo: '',
};

let settingsData = { ...DEFAULT_SETTINGS };
let isUsingSettingsFallback = false;
let selectedLogoFile = null;

(function init() {
    const user = initAdminShell('settings');
    if (!user) return;
    loadSettingsData();

    document.addEventListener('change', function (e) {
        if (e.target && e.target.id === 'siteLogoFile') {
            handleLogoFileChange(e.target);
        }
    });
})();

function handleLogoFileChange(input) {
    const file = input.files[0];
    if (!file) return;
    selectedLogoFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const previewDiv = document.getElementById('siteLogoPreview');
        previewDiv.style.backgroundImage = `url('${ev.target.result}')`;
        previewDiv.innerHTML = '';
    };
    reader.readAsDataURL(file);
}

function updateLogoPreview(filename) {
    const previewDiv = document.getElementById('siteLogoPreview');
    if (filename) {
        const src = getImageUrl(filename, 'site');
        previewDiv.style.backgroundImage = `url('${src}')`;
        previewDiv.innerHTML = '';
    } else {
        previewDiv.style.backgroundImage = 'none';
        previewDiv.innerHTML = '<i class="fas fa-image mr-2"></i> No logo loaded';
    }
}

function getSettingsFormData() {
    return {
        phone: document.getElementById('settingsPhone').value.trim(),
        whatsapp: document.getElementById('settingsWhatsapp').value.trim().replace(/[^\d]/g, ''),
        email: document.getElementById('settingsEmail').value.trim(),
        address: document.getElementById('settingsAddress').value.trim(),
        logo: document.getElementById('siteLogoExisting').value.trim(),
    };
}

function populateSettingsForm(data) {
    document.getElementById('settingsPhone').value = data.phone || '';
    document.getElementById('settingsWhatsapp').value = data.whatsapp || '';
    document.getElementById('settingsEmail').value = data.email || '';
    document.getElementById('settingsAddress').value = data.address || '';
    document.getElementById('siteLogoExisting').value = data.logo || '';
    document.getElementById('siteLogoFile').value = '';
    selectedLogoFile = null;
    if (!selectedLogoFile) updateLogoPreview(data.logo);
}

async function loadSettingsData() {
    const sourceText = document.getElementById('settingsSourceText');
    const sourceBadge = document.getElementById('settingsSourceBadge');
    const apiStatus = document.getElementById('settingsApiStatus');

    try {
        sourceText.textContent = 'Loading...';
        const res = await apiFetch('/api/settings');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await safeJson(res);
        if (data && data.email) {
            settingsData = data;
            isUsingSettingsFallback = false;
            sourceText.textContent = 'Server (API) ✅';
            sourceText.className = 'text-green-600';
            sourceBadge.style.display = 'none';
            apiStatus.classList.add('hidden');
            populateSettingsForm(data);
            return;
        }
        throw new Error('Invalid settings data from server');
    } catch (e) {
        console.warn('⚠️ Using fallback for settings data:', e.message);
        isUsingSettingsFallback = true;
        sourceText.textContent = 'Local Storage (Fallback) ⚠️';
        sourceText.className = 'text-amber-600';
        sourceBadge.style.display = 'inline-block';
        apiStatus.classList.remove('hidden');
        apiStatus.querySelector('span').innerHTML =
            `API endpoint not available. Using local fallback. Make sure your backend has <code>/api/settings</code> mounted and has been redeployed.`;
        settingsData = { ...DEFAULT_SETTINGS };
        populateSettingsForm(settingsData);
    }
}

async function saveSettingsContent() {
    const saveBtn = document.querySelector('#main .btn-primary');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }

    const payload = getSettingsFormData();

    if (!payload.email) {
        showToast('Please enter an email address.', true);
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
        return;
    }

    try {
        if (isUsingSettingsFallback) {
            if (selectedLogoFile) {
                showToast('⚠️ Logo upload needs the server API — not available in local fallback mode.', true);
            }
            settingsData = payload;
            showToast('✅ Settings updated (local fallback — not saved to server)');
            return;
        }

        const formData = new FormData();
        formData.append('phone', payload.phone);
        formData.append('whatsapp', payload.whatsapp);
        formData.append('email', payload.email);
        formData.append('address', payload.address);
        if (selectedLogoFile) {
            formData.append('logo', selectedLogoFile);
        }

        const res = await uploadFetch(`${API_BASE_URL}/api/settings`, formData, 'PUT');
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        const data = await safeJson(res);
        settingsData = data;
        populateSettingsForm(data);
        showToast('✅ Settings updated successfully! Site-wide phone/email/logo refreshed.');
    } catch (e) {
        showToast('❌ Error saving settings: ' + e.message, true);
        console.error(e);
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }
}

window.saveSettingsContent = saveSettingsContent;
