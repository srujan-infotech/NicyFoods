// ============================================================
//  Testimonials page logic
// ============================================================

(function init() {
    const user = initAdminShell('testimonials');
    if (!user) return;
    loadTestimonials();
    if (new URLSearchParams(window.location.search).get('new') === '1') {
        openTestimonialModal();
    }
})();

async function loadTestimonials() {
    try {
        const res = await apiFetch('/api/testimonials');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await safeJson(res);
        const tbody = document.getElementById('testimonialsTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="4"><div class="empty-state"><i class="fas fa-star"></i> No testimonials</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(t => `
                    <tr>
                        <td class="font-medium">${t.name}</td>
                        <td>${'⭐'.repeat(t.rating)}</td>
                        <td class="max-w-xs truncate">${t.text}</td>
                        <td>
                        <div class="actions-cell">
                            <button class="btn-edit" onclick="editTestimonial('${t._id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn-danger" onclick="deleteTestimonial('${t._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                        </td>
                    </tr>
                `).join('');
    } catch (e) {
        showToast('Failed to load testimonials: ' + e.message, true);
        console.error(e);
    }
}

function openTestimonialModal(data = null) {
    const isEdit = !!data;
    document.getElementById('testimonialModalTitle').innerHTML =
        `<i class="fas fa-star"></i> ${isEdit ? 'Edit Testimonial' : 'Add Testimonial'}`;
    document.getElementById('testimonialId').value = data?._id || '';
    document.getElementById('tName').value = data?.name || '';
    document.getElementById('tText').value = data?.text || '';
    document.getElementById('tRating').value = data?.rating || 5;
    document.getElementById('tColor').value = data?.avatarColor || '';
    openModal('testimonialModal');
}

async function editTestimonial(id) {
    try {
        const res = await apiFetch('/api/testimonials/' + id);
        if (!res.ok) throw new Error('Not found');
        const data = await safeJson(res);
        openTestimonialModal(data);
    } catch (e) {
        showToast('Error loading testimonial: ' + e.message, true);
        console.error(e);
    }
}

document.getElementById('testimonialForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('testimonialId').value;
    const payload = {
        name: document.getElementById('tName').value.trim(),
        text: document.getElementById('tText').value.trim(),
        rating: parseInt(document.getElementById('tRating').value, 10) || 5,
        avatarColor: document.getElementById('tColor').value.trim(),
    };
    try {
        let res;
        if (id) {
            res = await apiFetch('/api/testimonials/' + id, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            res = await apiFetch('/api/testimonials', { method: 'POST', body: JSON.stringify(payload) });
        }
        if (!res.ok) throw new Error('Save failed');
        showToast(id ? 'Testimonial updated' : 'Testimonial added');
        closeModal('testimonialModal');
        loadTestimonials();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving testimonial: ' + e.message, true);
        console.error(e);
    }
});

async function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial?')) return;
    try {
        const res = await apiFetch('/api/testimonials/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Testimonial deleted');
        loadTestimonials();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting testimonial: ' + e.message, true);
        console.error(e);
    }
}

window.openTestimonialModal = openTestimonialModal;
window.editTestimonial = editTestimonial;
window.deleteTestimonial = deleteTestimonial;
