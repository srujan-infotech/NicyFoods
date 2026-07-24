// // ============================================================
// //  NicyFoods Admin — Shared utilities
// //  Include AFTER js/auth-client.js and BEFORE js/sidebar.js
// //  and any page-specific script.
// // ============================================================

// const API_BASE_URL = "http://localhost:5000";

// // ============================================================
// //  AUTH GATE
// //  Call requireAdmin() at the top of every page. Returns the
// //  logged-in user object, or redirects and returns null.
// // ============================================================
// function requireAdmin() {
//     if (!AUTH.isLoggedIn()) {
//         window.location.href = 'login.html';
//         return null;
//     }
//     const user = AUTH.getUser();
//     if (!user || user.role !== 'admin') {
//         window.location.href = 'index.html';
//         return null;
//     }
//     return user;
// }

// // ============================================================
// //  API FETCH
// // ============================================================
// async function apiFetch(path, options = {}) {
//     try {
//         const res = await AUTH.authFetch(path, options);
//         if (res.status === 401) throw new Error('Session expired');
//         const contentType = res.headers.get('content-type');
//         if (!contentType || !contentType.includes('application/json')) {
//             const text = await res.text();
//             throw new Error(`Expected JSON but got ${contentType || 'unknown'}. ${text.substring(0, 200)}`);
//         }
//         return res;
//     } catch (e) {
//         throw new Error(`API call to ${path} failed: ${e.message}`);
//     }
// }

// async function safeJson(res) {
//     try { return await res.json(); } catch (e) { throw new Error('Invalid JSON response from server'); }
// }

// // ============================================================
// //  UPLOAD FETCH (multipart, token-authenticated, not via AUTH.authFetch
// //  since it must NOT set a JSON content-type header)
// // ============================================================
// function getAuthToken() {
//     let token = '';
//     try {
//         if (typeof AUTH.getToken === 'function') token = AUTH.getToken() || '';
//         else token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
//     } catch (e) {}
//     return token;
// }

// async function uploadFetch(path, formData) {
//     const token = getAuthToken();
//     return fetch(path, {
//         method: 'POST',
//         headers: token ? { Authorization: `Bearer ${token}` } : {},
//         body: formData,
//     });
// }

// // ============================================================
// //  TOAST
// // ============================================================
// function showToast(msg, isError = false) {
//     const toast = document.getElementById('toast');
//     if (!toast) return;
//     document.getElementById('toastMsg').textContent = msg;
//     toast.style.background = isError ? '#dc2626' : '#5C3A25';
//     toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
//     toast.classList.add('show');
//     clearTimeout(showToast._t);
//     showToast._t = setTimeout(() => toast.classList.remove('show'), 3500);
// }

// // ============================================================
// //  MODAL HELPERS
// // ============================================================
// function openModal(id) { document.getElementById(id).classList.add('open'); }
// function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// function initModalOverlayClickToClose() {
//     document.querySelectorAll('.modal-overlay').forEach(el => {
//         el.addEventListener('click', (e) => { if (e.target === el) el.classList.remove('open'); });
//     });
// }

// // ============================================================
// //  IMAGE URL HELPER (products / companies uploads)
// // ============================================================
// function getImageUrl(filename) {
//     if (!filename) return null;
//     if (filename.startsWith('http://') || filename.startsWith('https://')) {
//         return filename;
//     }
//     if (filename.startsWith('/uploads/') || filename.startsWith('uploads/')) {
//         return `${API_BASE_URL}/${filename.replace(/^\//, '')}`;
//     }
//     return `${API_BASE_URL}/uploads/products/${filename}`;
// }

// // ============================================================
// //  TEXT <-> LIST HELPERS
// // ============================================================
// function textToList(text) { return text.split('\n').map(l => l.trim()).filter(Boolean); }
// function listToText(list = []) { return (list || []).join('\n'); }

// // Expose everything used inline in HTML (onclick="...") to window
// window.API_BASE_URL = API_BASE_URL;
// window.requireAdmin = requireAdmin;
// window.apiFetch = apiFetch;
// window.safeJson = safeJson;
// window.getAuthToken = getAuthToken;
// window.uploadFetch = uploadFetch;
// window.showToast = showToast;
// window.openModal = openModal;
// window.closeModal = closeModal;
// window.getImageUrl = getImageUrl;
// window.textToList = textToList;
// window.listToText = listToText;








// ============================================================
//  NicyFoods Admin — Shared utilities
//  Include AFTER js/auth-client.js and BEFORE js/sidebar.js
//  and any page-specific script.
// ============================================================

const API_BASE_URL = "https://nicyfoods.srujaninfotech.com";

// ============================================================
//  AUTH GATE
//  Call requireAdmin() at the top of every page. Returns the
//  logged-in user object, or redirects and returns null.
// ============================================================
function requireAdmin() {
    if (!AUTH.isLoggedIn()) {
        window.location.href = 'login.html';
        return null;
    }
    const user = AUTH.getUser();
    if (!user || user.role !== 'admin') {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// ============================================================
//  API FETCH
// ============================================================
async function apiFetch(path, options = {}) {
    try {
        const res = await AUTH.authFetch(path, options);
        if (res.status === 401) throw new Error('Session expired');
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            throw new Error(`Expected JSON but got ${contentType || 'unknown'}. ${text.substring(0, 200)}`);
        }
        return res;
    } catch (e) {
        throw new Error(`API call to ${path} failed: ${e.message}`);
    }
}

async function safeJson(res) {
    try { return await res.json(); } catch (e) { throw new Error('Invalid JSON response from server'); }
}

// ============================================================
//  UPLOAD FETCH (multipart, token-authenticated, not via AUTH.authFetch
//  since it must NOT set a JSON content-type header)
//  method defaults to POST (products/companies use POST); pass 'PUT'
//  explicitly for update endpoints like hero.
// ============================================================
function getAuthToken() {
    let token = '';
    try {
        if (typeof AUTH.getToken === 'function') token = AUTH.getToken() || '';
        else token = localStorage.getItem('token') || localStorage.getItem('authToken') || '';
    } catch (e) {}
    return token;
}

async function uploadFetch(path, formData, method = 'POST') {
    const token = getAuthToken();
    return fetch(path, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    });
}

// ============================================================
//  TOAST
// ============================================================
function showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toastMsg').textContent = msg;
    toast.style.background = isError ? '#dc2626' : '#5C3A25';
    toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
//  MODAL HELPERS
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function initModalOverlayClickToClose() {
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => { if (e.target === el) el.classList.remove('open'); });
    });
}

// ============================================================
//  IMAGE URL HELPER (products / companies / hero uploads)
//  folder: which uploads/<folder>/ to fall back to when `filename`
//  is a bare filename with no path info (defaults to 'products'
//  to preserve existing behaviour for products/companies callers).
// ============================================================
function getImageUrl(filename, folder = 'products') {
    if (!filename) return null;
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }
    if (filename.startsWith('/uploads/') || filename.startsWith('uploads/')) {
        return `${API_BASE_URL}/${filename.replace(/^\//, '')}`;
    }
    return `${API_BASE_URL}/uploads/${folder}/${filename}`;
}

// ============================================================
//  TEXT <-> LIST HELPERS
// ============================================================
function textToList(text) { return text.split('\n').map(l => l.trim()).filter(Boolean); }
function listToText(list = []) { return (list || []).join('\n'); }

// Expose everything used inline in HTML (onclick="...") to window
window.API_BASE_URL = API_BASE_URL;
window.requireAdmin = requireAdmin;
window.apiFetch = apiFetch;
window.safeJson = safeJson;
window.getAuthToken = getAuthToken;
window.uploadFetch = uploadFetch;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.getImageUrl = getImageUrl;
window.textToList = textToList;
window.listToText = listToText;