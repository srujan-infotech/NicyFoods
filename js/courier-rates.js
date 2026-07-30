// ============================================================
//  Courier Rates page logic
//  Manages: shop pincode, weight-tier base rates (₹/250g, ₹/500g, ₹/1kg),
//  and zone multipliers (local / state / national) — same rules used
//  by cart.html and order-confirmation.html to compute delivery charge.
// ============================================================

const COURIER_RATES_API = '/api/admin/pincode-rates';

const DEFAULT_RATES = {
    shopPincode: '411052',
    rate250g: 40,
    rate500g: 70,
    rate1kg: 100,
    zoneLocalMultiplier: 1,
    zoneStateMultiplier: 1.5,
    zoneNationalMultiplier: 2,
};

let courierRates = { ...DEFAULT_RATES };
let isUsingRatesFallback = false;

(function init() {
    const user = initAdminShell('courierRates');
    if (!user) return;
    loadCourierRates();

    document.addEventListener('input', function(e) {
        if (e.target.closest('#courierRatesForm')) {
            runTestCalculator();
        }
    });

    document.getElementById('testWeight')?.addEventListener('input', runTestCalculator);
    document.getElementById('testPincode')?.addEventListener('input', runTestCalculator);
})();

// ============================================================
//  CALCULATION LOGIC — mirrors cart.html / order-confirmation.html exactly,
//  but reads rates from the current form values instead of hardcoded constants.
// ============================================================
function getRatesFromForm() {
    return {
        shopPincode: document.getElementById('shopPincode').value.trim(),
        rate250g: parseFloat(document.getElementById('rate250g').value) || 0,
        rate500g: parseFloat(document.getElementById('rate500g').value) || 0,
        rate1kg: parseFloat(document.getElementById('rate1kg').value) || 0,
        zoneLocalMultiplier: parseFloat(document.getElementById('zoneLocalMultiplier').value) || 1,
        zoneStateMultiplier: parseFloat(document.getElementById('zoneStateMultiplier').value) || 1,
        zoneNationalMultiplier: parseFloat(document.getElementById('zoneNationalMultiplier').value) || 1,
    };
}

function courierChargeForGrams(grams, rates) {
    var remaining = Math.max(0, Math.round(grams));
    var charge = 0;
    var breakdown = [];
    while (remaining >= 1000) {
        charge += rates.rate1kg;
        remaining -= 1000;
        breakdown.push('1kg → ₹' + rates.rate1kg);
    }
    if (remaining >= 500) {
        charge += rates.rate500g;
        remaining -= 500;
        breakdown.push('500g → ₹' + rates.rate500g);
    }
    if (remaining >= 250) {
        charge += rates.rate250g;
        remaining -= 250;
        breakdown.push('250g → ₹' + rates.rate250g);
    }
    if (remaining > 0) {
        charge += rates.rate250g;
        breakdown.push('+' + remaining + 'g (rounded up to 250g) → ₹' + rates.rate250g);
    }
    return { charge: charge, breakdown: breakdown };
}

function getZoneForPincode(pincode, shopPincode) {
    var clean = (pincode || '').trim();
    if (!clean || clean.length < 3) return 'unknown';
    var first3 = clean.substring(0, 3);
    var first2num = parseInt(clean.substring(0, 2), 10);
    var shopFirst3 = (shopPincode || '').substring(0, 3);
    if (first3 === shopFirst3) return 'local';
    if (first2num >= 40 && first2num <= 44) return 'state';
    return 'national';
}

function computeDeliveryCharge(pincode, grams, rates) {
    var cleanPincode = (pincode || '').trim();

    if (cleanPincode && cleanPincode === rates.shopPincode) {
        return { charge: 0, baseCharge: 0, breakdown: [], zone: 'exact', multiplier: 0, isLocal: true };
    }

    var base = courierChargeForGrams(grams, rates);
    var zone = getZoneForPincode(cleanPincode, rates.shopPincode);
    var multiplierMap = {
        local: rates.zoneLocalMultiplier,
        state: rates.zoneStateMultiplier,
        national: rates.zoneNationalMultiplier,
        unknown: rates.zoneStateMultiplier,
    };
    var multiplier = multiplierMap[zone] || 1;
    var finalCharge = Math.round((base.charge * multiplier) / 10) * 10;

    return { charge: finalCharge, baseCharge: base.charge, breakdown: base.breakdown, zone: zone, multiplier: multiplier, isLocal: false };
}

var ZONE_LABELS = { local: 'Local (Same City)', state: 'Within Maharashtra', national: 'Other State', exact: 'Same Pincode as Shop', unknown: 'Standard' };

function runTestCalculator() {
    const weightInput = document.getElementById('testWeight');
    const pincodeInput = document.getElementById('testPincode');
    const resultEl = document.getElementById('testResult');
    if (!weightInput || !pincodeInput || !resultEl) return;

    const grams = parseFloat(weightInput.value) || 0;
    const pincode = pincodeInput.value.trim();
    const rates = getRatesFromForm();

    if (grams <= 0) {
        resultEl.innerHTML = '<span class="text-slate-400">Enter a weight to see the calculated charge.</span>';
        return;
    }

    const result = computeDeliveryCharge(pincode, grams, rates);

    if (result.isLocal) {
        resultEl.innerHTML = `<span class="text-herbal font-bold">FREE</span> <span class="text-slate-400">(same pincode as shop)</span>`;
        return;
    }

    const zoneLabel = ZONE_LABELS[result.zone] || 'Standard';
    const breakdownText = result.breakdown.length ? result.breakdown.join(' + ') + ' = ₹' + result.baseCharge : '₹0';

    resultEl.innerHTML = `
        <div class="flex items-baseline gap-2 mb-1">
            <span class="text-2xl font-display text-kumkum">₹${result.charge}</span>
            <span class="zone-pill zone-${result.zone}">${zoneLabel}</span>
        </div>
        <div class="text-xs text-slate-400">${breakdownText} &times; ${result.multiplier}x zone rate</div>
    `;
}

// ============================================================
//  FORM <-> DATA
// ============================================================
function populateRatesForm(data) {
    document.getElementById('shopPincode').value = data.shopPincode || '';
    document.getElementById('rate250g').value = data.rate250g ?? '';
    document.getElementById('rate500g').value = data.rate500g ?? '';
    document.getElementById('rate1kg').value = data.rate1kg ?? '';
    document.getElementById('zoneLocalMultiplier').value = data.zoneLocalMultiplier ?? 1;
    document.getElementById('zoneStateMultiplier').value = data.zoneStateMultiplier ?? 1;
    document.getElementById('zoneNationalMultiplier').value = data.zoneNationalMultiplier ?? 1;
    runTestCalculator();
}

// ============================================================
//  LOAD / SAVE
// ============================================================
async function loadCourierRates() {
    const sourceText = document.getElementById('ratesSourceText');
    const sourceBadge = document.getElementById('ratesSourceBadge');
    const apiStatus = document.getElementById('ratesApiStatus');

    try {
        sourceText.textContent = 'Loading...';
        const res = await apiFetch(COURIER_RATES_API);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await safeJson(res);
        const data = json && json.data ? json.data : json;
        if (data && (data.shopPincode || data.rate1kg)) {
            courierRates = { ...DEFAULT_RATES, ...data };
            isUsingRatesFallback = false;
            sourceText.textContent = 'Server (API) ✅';
            sourceText.className = 'text-green-600';
            sourceBadge.style.display = 'none';
            apiStatus.classList.add('hidden');
            populateRatesForm(courierRates);
            return;
        }
        throw new Error('Invalid rates data from server');
    } catch (e) {
        console.warn('⚠️ Using fallback for courier rates:', e.message);
        isUsingRatesFallback = true;
        sourceText.textContent = 'Local Fallback ⚠️';
        sourceText.className = 'text-amber-600';
        sourceBadge.style.display = 'inline-block';
        apiStatus.classList.remove('hidden');
        apiStatus.querySelector('span').innerHTML =
            `API endpoint not available. Using local fallback defaults. To enable server sync, make sure your backend has <code>${COURIER_RATES_API}</code> mounted.`;
        courierRates = { ...DEFAULT_RATES };
        populateRatesForm(courierRates);
        if (!sessionStorage.getItem('courier_rates_fallback_shown')) {
            sessionStorage.setItem('courier_rates_fallback_shown', 'true');
            showToast('⚠️ Using fallback courier rates. Server API not available.', true);
        }
    }
}

async function saveCourierRates() {
    const saveBtn = document.querySelector('#main .btn-primary');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    }

    const payload = getRatesFromForm();

    if (!payload.shopPincode || payload.shopPincode.length !== 6) {
        showToast('Please enter a valid 6-digit shop pincode.', true);
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
        return;
    }

    try {
        if (isUsingRatesFallback) {
            courierRates = payload;
            showToast('✅ Courier rates updated (local fallback)');
            return;
        }
        const res = await apiFetch(COURIER_RATES_API, { method: 'PUT', body: JSON.stringify(payload) });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${res.status}`);
        }
        const json = await safeJson(res);
        courierRates = json && json.data ? json.data : json;
        populateRatesForm(courierRates);
        showToast('✅ Courier rates updated successfully!');
    } catch (e) {
        showToast('❌ Error saving courier rates: ' + e.message, true);
        console.error(e);
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes'; }
    }
}

window.saveCourierRates = saveCourierRates;
window.loadCourierRates = loadCourierRates;