// ============================================================
//  Hero section page logic
// ============================================================

const DEFAULT_HERO = {
    eyebrow: 'Handmade · Since 2017',
    title: 'Healthy Handmade Ladoos<br>Since 2017',
    subtitle: 'Pure Ghee • Natural Jaggery • No Maida & Preservatives • Homemade Quality',
    heroImage: 'https://nicyfoods.com/images/index_hero.jpg',
    ctaText: 'Shop All Products',
    ctaLink: 'products.html',
    stats: [
        { label: 'Years Crafting', value: '9', suffix: '+' },
        { label: 'Varieties', value: '25', suffix: '+' },
        { label: 'Handmade', value: '100', suffix: '%' }
    ]
};

let heroData = { ...DEFAULT_HERO };
let isUsingHeroFallback = false;
let selectedHeroFile = null;

(function init() {
    const user = initAdminShell('hero');
    if (!user) return;
    loadHeroData();

    document.addEventListener('input', function(e) {
        if (e.target.closest('#heroForm') && e.target.id !== 'heroImageFile') {
            updateHeroPreview(getHeroFormData());
        }
    });

    document.addEventListener('change', function(e) {
        if (e.target && e.target.id === 'heroImageFile') {
            handleHeroImageFileChange(e.target);
        }
    });
})();

function handleHeroImageFileChange(input) {
    const file = input.files[0];
    if (!file) return;
    selectedHeroFile = file;

    const reader = new FileReader();
    reader.onload = (ev) => {
        const previewDiv = document.getElementById('heroImagePreview');
        previewDiv.style.backgroundImage = `url('${ev.target.result}')`;
        previewDiv.innerHTML = '';
    };
    reader.readAsDataURL(file);
}

function renderHeroStats(stats) {
    const container = document.getElementById('heroStatsList');
    container.innerHTML = '';
    stats.forEach((stat, index) => {
        const row = document.createElement('div');
        row.className = 'hero-stat-row';
        row.innerHTML = `
                    <input type="text" class="stat-label" placeholder="Label e.g. Years Crafting" value="${stat.label || ''}" data-index="${index}" />
                    <input type="text" class="stat-value" placeholder="Value e.g. 9" value="${stat.value || ''}" data-index="${index}" />
                    <input type="text" class="stat-suffix" placeholder="Suffix e.g. +" value="${stat.suffix || ''}" data-index="${index}" style="max-width:60px;" />
                `;
        container.appendChild(row);
    });
}

function getHeroStatsFromForm() {
    const rows = document.querySelectorAll('#heroStatsList .hero-stat-row');
    const stats = [];
    rows.forEach(row => {
        const label = row.querySelector('.stat-label').value.trim();
        const value = row.querySelector('.stat-value').value.trim();
        const suffix = row.querySelector('.stat-suffix').value.trim();
        if (label || value) {
            stats.push({ label: label || 'Stat', value: value || '0', suffix: suffix || '' });
        }
    });
    while (stats.length < 3) {
        stats.push({ label: 'Stat ' + (stats.length + 1), value: '0', suffix: '' });
    }
    return stats.slice(0, 3);
}

function getHeroFormData() {
    return {
        eyebrow: document.getElementById('heroEyebrow').value.trim(),
        title: document.getElementById('heroTitle').value.trim(),
        subtitle: document.getElementById('heroSubtitle').value.trim(),
        heroImage: document.getElementById('heroImageExisting').value.trim(),
        ctaText: document.getElementById('heroCtaText').value.trim(),
        ctaLink: document.getElementById('heroCtaLink').value.trim(),
        stats: getHeroStatsFromForm(),
    };
}

function updateImagePreview(urlOrPath) {
    const previewDiv = document.getElementById('heroImagePreview');
    if (urlOrPath) {
        const src = urlOrPath.startsWith('http') ? urlOrPath : `${API_BASE_URL}${urlOrPath}`;
        previewDiv.style.backgroundImage = `url('${src}')`;
        previewDiv.innerHTML = '';
    } else {
        previewDiv.style.backgroundImage = 'none';
        previewDiv.innerHTML = '<i class="fas fa-image mr-2"></i> No image loaded';
    }
}

function updateHeroPreview(data) {
    document.getElementById('previewEyebrow').textContent = data.eyebrow || '';
    document.getElementById('previewTitle').innerHTML = data.title || '';
    document.getElementById('previewSubtitle').textContent = data.subtitle || '';
    document.getElementById('previewCta').textContent = (data.ctaText || 'Shop') + ' →';
    const statsHtml = (data.stats || []).map(s => `${s.value || '0'}${s.suffix || ''} ${s.label || ''}`).join(' · ');
    document.getElementById('previewStats').innerHTML = statsHtml || '';

    // नवीन निवडलेली file असेल तर ती आधीच preview मध्ये दिसतेय — जुन्या URL ने ती overwrite करू नका
    if (!selectedHeroFile) {
        updateImagePreview(data.heroImage);
    }
}

function populateHeroForm(data) {
    document.getElementById('heroEyebrow').value = data.eyebrow || '';
    document.getElementById('heroTitle').value = data.title || '';
    document.getElementById('heroSubtitle').value = data.subtitle || '';
    document.getElementById('heroImageExisting').value = data.heroImage || '';
    document.getElementById('heroCtaText').value = data.ctaText || '';
    document.getElementById('heroCtaLink').value = data.ctaLink || '';
    document.getElementById('heroImageFile').value = '';
    selectedHeroFile = null;
    renderHeroStats(data.stats || []);
    updateHeroPreview(data);
}

async function loadHeroData() {
    const sourceText = document.getElementById('heroSourceText');
    const sourceBadge = document.getElementById('heroSourceBadge');
    const apiStatus = document.getElementById('heroApiStatus');

    try {
        sourceText.textContent = 'Loading...';
        const res = await apiFetch('/api/hero');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await safeJson(res);
        if (data && data.title) {
            heroData = data;
            isUsingHeroFallback = false;
            sourceText.textContent = 'Server (API) ✅';
            sourceText.className = 'text-green-600';
            sourceBadge.style.display = 'none';
            apiStatus.classList.add('hidden');
            populateHeroForm(data);
            return;
        }
        throw new Error('Invalid hero data from server');
    } catch (e) {
        console.warn('⚠️ Using fallback for hero data:', e.message);
        isUsingHeroFallback = true;
        sourceText.textContent = 'Local Storage (Fallback) ⚠️';
        sourceText.className = 'text-amber-600';
        sourceBadge.style.display = 'inline-block';
        apiStatus.classList.remove('hidden');
        apiStatus.querySelector('span').innerHTML =
            `API endpoint not available. Using local fallback. To enable server sync, make sure your backend has <code>/api/hero</code> route mounted.`;
        heroData = { ...DEFAULT_HERO };
        populateHeroForm(heroData);
        if (!sessionStorage.getItem('hero_fallback_shown')) {
            sessionStorage.setItem('hero_fallback_shown', 'true');
            showToast('⚠️ Using fallback hero data. Server API not available (404).', true);
        }
    }
}

async function saveHeroContent() {
    const saveBtn = document.querySelector('#main .btn-primary');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }

    const payload = getHeroFormData();

    if (!payload.title) {
        showToast('Please enter a title.', true);
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
        return;
    }

    try {
        if (isUsingHeroFallback) {
            if (selectedHeroFile) {
                showToast('⚠️ Image upload needs the server API — not available in local fallback mode.', true);
            }
            heroData = payload;
            updateHeroPreview(payload);
            showToast('✅ Hero updated (local fallback)');
            return;
        }

        const formData = new FormData();
        formData.append('eyebrow', payload.eyebrow);
        formData.append('title', payload.title);
        formData.append('subtitle', payload.subtitle);
        formData.append('ctaText', payload.ctaText);
        formData.append('ctaLink', payload.ctaLink);
        formData.append('stats', JSON.stringify(payload.stats));
        if (selectedHeroFile) {
            formData.append('heroImage', selectedHeroFile);
        }

        const res = await uploadFetch(`${API_BASE_URL}/api/hero`, formData, 'PUT');
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        const data = await safeJson(res);
        heroData = data;
        populateHeroForm(data);
        showToast('✅ Hero section updated successfully!');
    } catch (e) {
        showToast('❌ Error saving hero: ' + e.message, true);
        console.error(e);
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }
}

window.saveHeroContent = saveHeroContent;
window.loadHeroData = loadHeroData;