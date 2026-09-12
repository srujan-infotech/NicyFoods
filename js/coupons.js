// ============================================================
//  Coupons page logic
// ============================================================

const COUPONS_API = '/api/coupons';

(function init() {
    const user = initAdminShell('coupons');
    if (!user) return;
    loadCoupons();
    if (new URLSearchParams(window.location.search).get('new') === '1') {
        openCouponModal();
    }
})();

function onDiscountTypeChange() {
    const type = document.getElementById('cDiscountType').value;
    const label = document.getElementById('cDiscountValueLabel');
    const maxGroup = document.getElementById('cMaxDiscountGroup');
    if (type === 'flat') {
        label.innerHTML = '<i class="fas fa-tag"></i> Discount Value (₹)';
        maxGroup.style.display = 'none';
    } else {
        label.innerHTML = '<i class="fas fa-tag"></i> Discount Value (%)';
        maxGroup.style.display = '';
    }
}

function formatDiscount(c) {
    if (c.discountType === 'flat') return '₹' + c.discountValue + ' OFF';
    let text = c.discountValue + '% OFF';
    if (c.maxDiscountAmount) text += ' (up to ₹' + c.maxDiscountAmount + ')';
    return text;
}

function couponStatus(c) {
    if (!c.isActive) return { key: 'inactive', label: 'Inactive' };
    if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { key: 'expired', label: 'Expired' };
    if (c.usageLimit != null && c.usageLimit > 0 && c.usedCount >= c.usageLimit) return { key: 'full', label: 'Limit Reached' };
    return { key: 'active', label: 'Active' };
}

function usageBarHtml(c) {
    if (c.usageLimit == null || c.usageLimit <= 0) {
        return `<div class="usage-text">${c.usedCount} used &middot; Unlimited</div>`;
    }
    const pct = Math.min(100, Math.round((c.usedCount / c.usageLimit) * 100));
    return `
        <div class="usage-text">${c.usedCount} / ${c.usageLimit} used</div>
        <div class="usage-bar-wrap"><div class="usage-bar-fill" style="width:${pct}%;"></div></div>
    `;
}

async function loadCoupons() {
    try {
        const res = await apiFetch(COUPONS_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = json.data || [];
        const tbody = document.getElementById('couponsTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-tags"></i> No coupons yet — add your first one</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(c => {
            const status = couponStatus(c);
            return `
                <tr>
                    <td>
                        <span class="coupon-code-pill"><i class="fas fa-ticket"></i>${c.code}</span>
                        ${c.isFeatured ? '<i class="fas fa-star featured-star" title="Featured on cart banner"></i>' : ''}
                        ${c.description ? `<div class="coupon-desc">${c.description}</div>` : ''}
                    </td>
                    <td class="font-medium">${formatDiscount(c)}</td>
                    <td>${c.minOrderAmount ? '₹' + c.minOrderAmount : '—'}</td>
                    <td>${usageBarHtml(c)}</td>
                    <td>${c.perCustomerLimit ? c.perCustomerLimit + 'x / customer' : 'Unlimited'}</td>
                    <td><span class="status-pill ${status.key}">${status.label}</span></td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-toggle" title="${c.isActive ? 'Deactivate' : 'Activate'}" onclick="toggleCouponActive('${c._id}', ${!c.isActive})"><i class="fas ${c.isActive ? 'fa-pause' : 'fa-play'}"></i></button>
                            <button class="btn-edit" onclick="editCoupon('${c._id}')"><i class="fas fa-edit"></i></button>
                            <button class="btn-danger" onclick="deleteCoupon('${c._id}')"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (e) {
        showToast('Failed to load coupons: ' + e.message, true);
        console.error(e);
    }
}

function openCouponModal(data = null) {
    const isEdit = !!data;
    document.getElementById('couponModalTitle').innerHTML =
        `<i class="fas fa-tag"></i> ${isEdit ? 'Edit Coupon' : 'Add Coupon'}`;
    document.getElementById('couponId').value = data?._id || '';
    document.getElementById('cCode').value = data?.code || '';
    document.getElementById('cDescription').value = data?.description || '';
    document.getElementById('cDiscountType').value = data?.discountType || 'percent';
    document.getElementById('cDiscountValue').value = data?.discountValue ?? '';
    document.getElementById('cMaxDiscountAmount').value = data?.maxDiscountAmount ?? '';
    document.getElementById('cMinOrderAmount').value = data?.minOrderAmount ?? '';
    document.getElementById('cUsageLimit').value = data?.usageLimit ?? '';
    document.getElementById('cPerCustomerLimit').value = (data && data.perCustomerLimit != null) ? data.perCustomerLimit : 1;
    document.getElementById('cExpiresAt').value = data?.expiresAt ? data.expiresAt.substring(0, 10) : '';
    document.getElementById('cIsActive').checked = data ? !!data.isActive : true;
    document.getElementById('cIsFeatured').checked = data ? !!data.isFeatured : false;
    onDiscountTypeChange();
    openModal('couponModal');
}

async function editCoupon(id) {
    try {
        const res = await apiFetch(COUPONS_API + '/' + id);
        if (!res.ok) throw new Error('Not found');
        const json = await safeJson(res);
        openCouponModal(json.data);
    } catch (e) {
        showToast('Error loading coupon: ' + e.message, true);
        console.error(e);
    }
}

document.getElementById('couponForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('couponId').value;

    const usageLimitRaw = document.getElementById('cUsageLimit').value.trim();
    const perCustomerRaw = document.getElementById('cPerCustomerLimit').value.trim();
    const maxDiscountRaw = document.getElementById('cMaxDiscountAmount').value.trim();

    const payload = {
        code: document.getElementById('cCode').value.trim().toUpperCase(),
        description: document.getElementById('cDescription').value.trim(),
        discountType: document.getElementById('cDiscountType').value,
        discountValue: parseFloat(document.getElementById('cDiscountValue').value) || 0,
        maxDiscountAmount: maxDiscountRaw === '' ? null : parseFloat(maxDiscountRaw),
        minOrderAmount: parseFloat(document.getElementById('cMinOrderAmount').value) || 0,
        usageLimit: usageLimitRaw === '' ? null : parseInt(usageLimitRaw, 10),
        perCustomerLimit: perCustomerRaw === '' ? null : parseInt(perCustomerRaw, 10),
        isActive: document.getElementById('cIsActive').checked,
        isFeatured: document.getElementById('cIsFeatured').checked,
        expiresAt: document.getElementById('cExpiresAt').value || null,
    };

    if (!payload.code) {
        showToast('Please enter a coupon code', true);
        return;
    }
    if (payload.discountType === 'percent' && payload.discountValue > 100) {
        showToast('A percentage discount cannot exceed 100%', true);
        return;
    }

    try {
        let res;
        if (id) {
            res = await apiFetch(COUPONS_API + '/' + id, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
            res = await apiFetch(COUPONS_API, { method: 'POST', body: JSON.stringify(payload) });
        }
        if (!res.ok) {
            const errJson = await safeJson(res).catch(() => ({}));
            throw new Error(errJson.message || 'Save failed');
        }
        showToast(id ? 'Coupon updated' : 'Coupon added');
        closeModal('couponModal');
        loadCoupons();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving coupon: ' + e.message, true);
        console.error(e);
    }
});

async function toggleCouponActive(id, nextActive) {
    try {
        const res = await apiFetch(COUPONS_API + '/' + id, { method: 'PUT', body: JSON.stringify({ isActive: nextActive }) });
        if (!res.ok) throw new Error('Update failed');
        showToast(nextActive ? 'Coupon activated' : 'Coupon deactivated');
        loadCoupons();
    } catch (e) {
        showToast('Error updating coupon: ' + e.message, true);
        console.error(e);
    }
}

async function deleteCoupon(id) {
    if (!confirm('Delete this coupon? This cannot be undone.')) return;
    try {
        const res = await apiFetch(COUPONS_API + '/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Coupon deleted');
        loadCoupons();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting coupon: ' + e.message, true);
        console.error(e);
    }
}

window.onDiscountTypeChange = onDiscountTypeChange;
window.openCouponModal = openCouponModal;
window.editCoupon = editCoupon;
window.toggleCouponActive = toggleCouponActive;
window.deleteCoupon = deleteCoupon;
