// ============================================================
//  Mission & Vision page logic
// ============================================================

(function init() {
    const user = initAdminShell('missionVision');
    if (!user) return;
    loadMissionVision();
})();

async function loadMissionVision() {
    try {
        const res = await apiFetch('/api/mission-vision');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        if (json.success && json.data) {
            const data = json.data;
            document.getElementById('mvTaglineInput').value = data.tagline || '';
            document.getElementById('mvVisionInput').value = data.vision || '';
            document.getElementById('mvMissionInput').value = data.mission || '';
        }
    } catch (e) {
        showToast('Error loading mission & vision: ' + e.message, true);
        console.error(e);
    }
}

async function saveMissionVision() {
    const saveBtn = document.querySelector('#main .btn-primary');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'; }

    const tagline = document.getElementById('mvTaglineInput').value.trim();
    const vision = document.getElementById('mvVisionInput').value.trim();
    const mission = document.getElementById('mvMissionInput').value.trim();

    if (!vision || !mission) {
        showToast('Please fill in both Vision and Mission fields.', true);
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
        return;
    }

    const payload = { tagline, vision, mission };

    try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE_URL}/api/mission-vision`, {
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

        showToast('✅ Mission & Vision updated successfully!');
        await loadMissionVision();
    } catch (e) {
        showToast('❌ Error saving: ' + e.message, true);
        console.error(e);
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }
}

window.loadMissionVision = loadMissionVision;
window.saveMissionVision = saveMissionVision;
