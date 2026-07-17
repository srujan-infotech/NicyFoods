// ============================================================
//  Our Story page logic
// ============================================================

const DEFAULT_STORY = {
    badge: 'Our Story',
    heading: 'The Journey So Far',
    year: '2017',
    yearLabel: 'Est. In Pune',
    paragraphs: [
        "NicyFoods was founded in 2017 with a simple yet powerful vision: to bring authentic, healthy handmade food products to families across India. What began as a passion for traditional recipes and pure ingredients has grown into a trusted brand serving thousands of satisfied customers.",
        "We believed then, and we believe now, that food should be nourishing, delicious, and made with integrity. In a world filled with processed foods and artificial additives, we stand committed to creating ladoos that honor traditional methods while meeting modern health standards.",
        "Every ladoo we craft represents our dedication to your family's wellness. From sourcing the finest ghee to selecting premium jaggery and hand-selecting herbs and spices, we maintain rigorous standards at every step of production.",
        "Today, NicyFoods offers 25+ varieties of handmade ladoos, each carefully formulated to serve different nutritional needs and preferences. From traditional favorites to innovative herbal blends, and even baby-friendly options, there's a NicyFoods product for every member of your family.",
    ],
};

let storyData = { ...DEFAULT_STORY };
let isUsingStoryFallback = false;

(function init() {
    const user = initAdminShell('story');
    if (!user) return;
    loadStoryData();

    document.addEventListener('input', function(e) {
        if (e.target.closest('#storyForm')) {
            updateStoryPreview(getStoryFormData());
        }
    });
})();

function updateStoryPreview(data) {
    document.getElementById('storyPreviewBadge').textContent = data.badge || '';
    document.getElementById('storyPreviewHeading').textContent = data.heading || '';
    document.getElementById('storyPreviewYear').textContent = data.year || '';
    document.getElementById('storyPreviewYearLabel').textContent = data.yearLabel || '';
    const paras = Array.isArray(data.paragraphs) ? data.paragraphs : [];
    const preview = document.getElementById('storyPreviewParagraphs');
    preview.innerHTML = paras.length ?
        paras.map(p => `<p style="margin-bottom:0.4rem;">${p.length > 140 ? p.slice(0, 140) + '…' : p}</p>`).join('') :
        '<span style="color:#8a7362;">No paragraphs yet.</span>';
}

function populateStoryForm(data) {
    document.getElementById('storyBadge').value = data.badge || '';
    document.getElementById('storyHeading').value = data.heading || '';
    document.getElementById('storyYear').value = data.year || '';
    document.getElementById('storyYearLabel').value = data.yearLabel || '';
    document.getElementById('storyParagraphs').value = listToText(data.paragraphs || []);
    updateStoryPreview(data);
}

function getStoryFormData() {
    return {
        badge: document.getElementById('storyBadge').value.trim(),
        heading: document.getElementById('storyHeading').value.trim(),
        year: document.getElementById('storyYear').value.trim(),
        yearLabel: document.getElementById('storyYearLabel').value.trim(),
        paragraphs: textToList(document.getElementById('storyParagraphs').value),
    };
}

async function loadStoryData() {
    const sourceText = document.getElementById('storySourceText');
    const sourceBadge = document.getElementById('storySourceBadge');
    const apiStatus = document.getElementById('storyApiStatus');
    try {
        sourceText.textContent = 'Loading...';
        const res = await apiFetch('/api/story');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = json.data || json;
        if (data && data.heading) {
            storyData = data;
            isUsingStoryFallback = false;
            sourceText.textContent = 'Server (API) ✅';
            sourceText.className = 'text-green-600';
            sourceBadge.style.display = 'none';
            apiStatus.classList.add('hidden');
            populateStoryForm(data);
            return;
        }
        throw new Error('Invalid story data from server');
    } catch (e) {
        console.warn('⚠️ Using fallback for story data:', e.message);
        isUsingStoryFallback = true;
        sourceText.textContent = 'Local Storage (Fallback) ⚠️';
        sourceText.className = 'text-amber-600';
        sourceBadge.style.display = 'inline-block';
        apiStatus.classList.remove('hidden');
        apiStatus.querySelector('span').innerHTML =
            `API endpoint not available. Using local fallback. To enable server sync, make sure your backend has <code>/api/story</code> route mounted.`;
        storyData = { ...DEFAULT_STORY };
        populateStoryForm(storyData);
    }
}

async function saveStoryContent() {
    const saveBtn = document.querySelector('#main .btn-primary');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }
    const payload = getStoryFormData();
    if (!payload.heading) {
        showToast('Please enter a heading.', true);
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
        return;
    }
    try {
        if (isUsingStoryFallback) {
            storyData = payload;
            updateStoryPreview(payload);
            showToast('✅ Story updated (local fallback)');
            return;
        }
        const res = await apiFetch('/api/story', { method: 'PUT', body: JSON.stringify(payload) });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        const json = await safeJson(res);
        const data = json.data || json;
        storyData = data;
        updateStoryPreview(data);
        showToast('✅ Story section updated successfully!');
    } catch (e) {
        showToast('❌ Error saving story: ' + e.message, true);
        console.error(e);
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }
}

window.saveStoryContent = saveStoryContent;
window.loadStoryData = loadStoryData;
