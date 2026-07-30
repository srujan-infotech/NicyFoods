// // ============================================================
// //  Products page logic
// // ============================================================

// (function init() {
//     const user = initAdminShell('products');
//     if (!user) return;
//     loadProducts();
//     if (new URLSearchParams(window.location.search).get('new') === '1') {
//         openProductModal();
//     }
// })();

// // ============================================================
// //  MULTI-IMAGE HANDLING
// // ============================================================
// const imageFilesInput = document.getElementById('pImageFiles');
// const imagePreviewGrid = document.getElementById('imagePreviewGrid');
// const imageUploadStatus = document.getElementById('imageUploadStatus');
// const pExistingImages = document.getElementById('pExistingImages');

// function renderImagePreviews(files = [], existingUrls = []) {
//     imagePreviewGrid.innerHTML = '';
//     existingUrls.forEach((url, index) => {
//         const fullUrl = getImageUrl(url);
//         if (!fullUrl) return;
//         const wrapper = document.createElement('div');
//         wrapper.className = 'image-preview-item';
//         wrapper.innerHTML = `
//                     <img src="${fullUrl}" alt="Product image ${index+1}" onerror="this.style.display='none';this.parentElement.querySelector('.img-fallback').style.display='flex';" />
//                     <div class="img-fallback" style="display:none;width:100%;height:100%;background:#f8f2ea;align-items:center;justify-content:center;color:#cbb9ab;font-size:0.7rem;flex-direction:column;"><i class="fas fa-image"></i><span style="font-size:0.5rem;">${url.split('/').pop().slice(0,10)}</span></div>
//                     <button type="button" class="remove-img" data-url="${url}" title="Remove image">
//                         <i class="fas fa-times"></i>
//                     </button>
//                 `;
//         wrapper.querySelector('.remove-img').addEventListener('click', function(e) {
//             e.stopPropagation();
//             removeExistingImage(this.dataset.url);
//         });
//         imagePreviewGrid.appendChild(wrapper);
//     });

//     for (let file of files) {
//         const wrapper = document.createElement('div');
//         wrapper.className = 'image-preview-item';
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             wrapper.innerHTML = `
//                         <img src="${e.target.result}" alt="New upload" />
//                         <button type="button" class="remove-img" data-file="${file.name}" title="Remove">
//                             <i class="fas fa-times"></i>
//                         </button>
//                     `;
//             wrapper.querySelector('.remove-img').addEventListener('click', function() {
//                 const currentFiles = Array.from(imageFilesInput.files);
//                 const filtered = currentFiles.filter(f => f.name !== this.dataset.file);
//                 const dataTransfer = new DataTransfer();
//                 filtered.forEach(f => dataTransfer.items.add(f));
//                 imageFilesInput.files = dataTransfer.files;
//                 renderImagePreviews(Array.from(imageFilesInput.files), getCurrentExistingImages());
//                 updateUploadStatus();
//             });
//         };
//         reader.readAsDataURL(file);
//         imagePreviewGrid.appendChild(wrapper);
//     }
//     updateUploadStatus();
// }

// function getCurrentExistingImages() {
//     const existing = document.getElementById('pExistingImages').value;
//     return existing ? existing.split(',') : [];
// }

// function setExistingImages(urls) {
//     document.getElementById('pExistingImages').value = urls.join(',');
// }

// function removeExistingImage(url) {
//     let existing = getCurrentExistingImages();
//     existing = existing.filter(u => u !== url);
//     setExistingImages(existing);
//     renderImagePreviews(Array.from(imageFilesInput.files), existing);
// }

// function updateUploadStatus() {
//     const total = getCurrentExistingImages().length + imageFilesInput.files.length;
//     if (total === 0) {
//         imageUploadStatus.textContent = 'No images selected. Please upload at least one.';
//         imageUploadStatus.className = 'image-upload-status error';
//     } else {
//         imageUploadStatus.textContent = `${total} image(s) ready (max 3)`;
//         imageUploadStatus.className = 'image-upload-status success';
//     }
// }

// imageFilesInput.addEventListener('change', function() {
//     const files = Array.from(this.files);
//     if (files.length + getCurrentExistingImages().length > 3) {
//         alert('You can upload a maximum of 3 images.');
//         this.value = '';
//         return;
//     }
//     renderImagePreviews(files, getCurrentExistingImages());
// });

// function populateExistingImages(urls) {
//     if (!urls) urls = [];
//     setExistingImages(urls);
//     renderImagePreviews([], urls);
// }

// // ============================================================
// //  STOCK TOGGLE
// // ============================================================
// function toggleStock() {
//     const toggle = document.getElementById('stockToggle');
//     const hidden = document.getElementById('pInStock');
//     const label = document.getElementById('stockLabel');
//     const isActive = toggle.classList.toggle('active');
//     hidden.value = isActive ? 'true' : 'false';
//     label.textContent = isActive ? 'Yes, available' : 'No, out of stock';
// }

// // ============================================================
// //  WEIGHT OPTIONS
// // ============================================================
// function addWeightRow(label = '', price = '') {
//     const row = document.createElement('div');
//     row.className = 'weight-row';
//     row.innerHTML = `
//                 <input type="text" class="weight-label" placeholder="e.g. 1 Kg" value="${label}">
//                 <input type="number" class="weight-price" placeholder="Price (₹)" min="0" step="0.01" value="${price}">
//                 <button type="button" class="btn-icon-remove" title="Remove" onclick="this.closest('.weight-row').remove()">
//                 <i class="fas fa-trash-alt"></i>
//                 </button>
//             `;
//     document.getElementById('weightOptionsList').appendChild(row);
// }

// function getWeightOptions() {
//     return [...document.querySelectorAll('#weightOptionsList .weight-row')]
//         .map(row => ({
//             label: row.querySelector('.weight-label').value.trim(),
//             price: parseFloat(row.querySelector('.weight-price').value),
//         }))
//         .filter(w => w.label && !isNaN(w.price));
// }

// function setWeightOptions(options = []) {
//     const container = document.getElementById('weightOptionsList');
//     container.innerHTML = '';
//     if (!options.length) { addWeightRow(); return; }
//     options.forEach(w => addWeightRow(w.label, w.price));
// }

// // ============================================================
// //  MODAL OPEN / EDIT
// // ============================================================
// function openProductModal(data = null) {
//     const isEdit = !!data;
//     document.getElementById('productModalTitle').innerHTML =
//         `<i class="fas fa-box"></i> ${isEdit ? 'Edit Product' : 'Add Product'}`;
//     document.getElementById('productId').value = data?._id || '';
//     document.getElementById('pName').value = data?.name || '';
//     document.getElementById('pDesc').value = data?.description || '';
//     document.getElementById('pPrice').value = data?.price || '';
//     document.getElementById('pCategory').value = data?.category || 'millet';
//     document.getElementById('pFeatures').value = listToText(data?.features);
//     document.getElementById('pIngredients').value = listToText(data?.ingredients);
//     document.getElementById('pBenefits').value = listToText(data?.benefits);

//     const inStock = data?.inStock !== undefined ? data.inStock : true;
//     const toggle = document.getElementById('stockToggle');
//     const hidden = document.getElementById('pInStock');
//     const label = document.getElementById('stockLabel');
//     if (inStock) {
//         toggle.classList.add('active');
//         hidden.value = 'true';
//         label.textContent = 'Yes, available';
//     } else {
//         toggle.classList.remove('active');
//         hidden.value = 'false';
//         label.textContent = 'No, out of stock';
//     }

//     const images = data?.images || (data?.image ? [data.image] : []);
//     populateExistingImages(images);
//     imageFilesInput.value = '';

//     setWeightOptions(data?.weightOptions || []);
//     openModal('productModal');
// }

// async function editProduct(id) {
//     try {
//         const res = await apiFetch('/api/products/' + id);
//         if (!res.ok) throw new Error('Product not found');
//         const data = await safeJson(res);
//         openProductModal(data);
//     } catch (e) {
//         showToast('Error loading product: ' + e.message, true);
//         console.error(e);
//     }
// }

// document.getElementById('productForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const id = document.getElementById('productId').value;
//     const saveBtn = document.getElementById('productSaveBtn');

//     const existingImages = getCurrentExistingImages();
//     const newFiles = Array.from(imageFilesInput.files);

//     if (existingImages.length === 0 && newFiles.length === 0) {
//         imageUploadStatus.textContent = 'Please add at least one product image.';
//         imageUploadStatus.className = 'image-upload-status error';
//         return;
//     }

//     const total = existingImages.length + newFiles.length;
//     if (total > 3) {
//         imageUploadStatus.textContent = `You have ${total} images, maximum is 3.`;
//         imageUploadStatus.className = 'image-upload-status error';
//         return;
//     }

//     const formData = new FormData();
//     const fields = {
//         name: document.getElementById('pName').value.trim(),
//         description: document.getElementById('pDesc').value.trim(),
//         price: document.getElementById('pPrice').value,
//         category: document.getElementById('pCategory').value,
//         features: JSON.stringify(textToList(document.getElementById('pFeatures').value)),
//         ingredients: JSON.stringify(textToList(document.getElementById('pIngredients').value)),
//         benefits: JSON.stringify(textToList(document.getElementById('pBenefits').value)),
//         inStock: document.getElementById('pInStock').value,
//         weightOptions: JSON.stringify(getWeightOptions()),
//     };
//     Object.keys(fields).forEach(key => formData.append(key, fields[key]));
//     formData.append('existingImages', JSON.stringify(existingImages));
//     newFiles.forEach(file => formData.append('images', file));

//     saveBtn.disabled = true;
//     saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

//     try {
//         const url = id ? `${API_BASE_URL}/api/products/${id}` : `${API_BASE_URL}/api/products`;
//         const method = id ? 'PUT' : 'POST';
//         const token = getAuthToken();
//         const finalRes = await fetch(url, {
//             method: method,
//             headers: token ? { Authorization: `Bearer ${token}` } : {},
//             body: formData,
//         });

//         if (!finalRes.ok) {
//             const errData = await finalRes.json().catch(() => ({}));
//             throw new Error(errData.message || `HTTP ${finalRes.status}`);
//         }

//         showToast(id ? 'Product updated' : 'Product created');
//         closeModal('productModal');
//         loadProducts();
//         loadNavCounts();
//     } catch (e) {
//         showToast('Error saving product: ' + e.message, true);
//         console.error(e);
//     } finally {
//         saveBtn.disabled = false;
//         saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
//     }
// });

// // ============================================================
// //  LOAD / DELETE
// // ============================================================
// async function loadProducts() {
//     try {
//         const res = await apiFetch('/api/products');
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await safeJson(res);
//         const tbody = document.getElementById('productsTableBody');
//         if (!data.length) {
//             tbody.innerHTML =
//                 `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-box-open"></i> No products found</div></td></tr>`;
//             return;
//         }
//         tbody.innerHTML = data.map(p => {
//             const img = p.image || (p.images && p.images.length ? p.images[0] : null);
//             const imgUrl = img ? getImageUrl(img) : null;
//             return `
//                         <tr>
//                             <td>${imgUrl ? `<img src="${imgUrl}" alt="${p.name}" class="product-thumb" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'product-thumb-placeholder\\'><i class=\\'fas fa-image\\'></i></div>';" />` : '<div class="product-thumb-placeholder"><i class="fas fa-image"></i></div>'}</td>
//                             <td class="font-medium">${p.name}</td>
//                             <td>₹${p.price}</td>
//                             <td><span style="background:#fef3e2;color:#8a5a2a;padding:0.1rem 0.6rem;border-radius:999px;font-size:0.65rem;">${p.category}</span></td>
//                             <td>${p.inStock ? '<span style="color:#5F7A4F;"><i class="fas fa-check-circle"></i> In Stock</span>' : '<span style="color:#dc2626;"><i class="fas fa-times-circle"></i> Out of Stock</span>'}</td>
//                             <td>
//                             <div class="actions-cell">
//                                 <button class="btn-edit" onclick="editProduct('${p._id}')"><i class="fas fa-edit"></i></button>
//                                 <button class="btn-danger" onclick="deleteProduct('${p._id}')"><i class="fas fa-trash-alt"></i></button>
//                             </div>
//                             </td>
//                         </tr>
//                     `}).join('');
//     } catch (e) {
//         showToast('Failed to load products: ' + e.message, true);
//         console.error(e);
//     }
// }

// async function deleteProduct(id) {
//     if (!confirm('Delete this product?')) return;
//     try {
//         const res = await apiFetch('/api/products/' + id, { method: 'DELETE' });
//         if (!res.ok) throw new Error('Delete failed');
//         showToast('Product deleted');
//         loadProducts();
//         loadNavCounts();
//     } catch (e) {
//         showToast('Error deleting product: ' + e.message, true);
//         console.error(e);
//     }
// }

// window.openProductModal = openProductModal;
// window.editProduct = editProduct;
// window.deleteProduct = deleteProduct;
// window.toggleStock = toggleStock;
// window.addWeightRow = addWeightRow;







// // ============================================================
// //  Products page logic
// // ============================================================

// (function init() {
//     const user = initAdminShell('products');
//     if (!user) return;
//     loadProducts();
//     if (new URLSearchParams(window.location.search).get('new') === '1') {
//         openProductModal();
//     }
// })();

// // ============================================================
// //  MULTI-IMAGE HANDLING
// // ============================================================
// const imageFilesInput = document.getElementById('pImageFiles');
// const imagePreviewGrid = document.getElementById('imagePreviewGrid');
// const imageUploadStatus = document.getElementById('imageUploadStatus');
// const pExistingImages = document.getElementById('pExistingImages');

// function renderImagePreviews(files = [], existingUrls = []) {
//     imagePreviewGrid.innerHTML = '';
//     existingUrls.forEach((url, index) => {
//         const fullUrl = getImageUrl(url);
//         if (!fullUrl) return;
//         const wrapper = document.createElement('div');
//         wrapper.className = 'image-preview-item';
//         wrapper.innerHTML = `
//                     <img src="${fullUrl}" alt="Product image ${index + 1}" onerror="this.style.display='none';this.parentElement.querySelector('.img-fallback').style.display='flex';" />
//                     <div class="img-fallback" style="display:none;width:100%;height:100%;background:#f8f2ea;align-items:center;justify-content:center;color:#cbb9ab;font-size:0.7rem;flex-direction:column;"><i class="fas fa-image"></i><span style="font-size:0.5rem;">${url.split('/').pop().slice(0, 10)}</span></div>
//                     <button type="button" class="remove-img" data-url="${url}" title="Remove image">
//                         <i class="fas fa-times"></i>
//                     </button>
//                 `;
//         wrapper.querySelector('.remove-img').addEventListener('click', function (e) {
//             e.stopPropagation();
//             removeExistingImage(this.dataset.url);
//         });
//         imagePreviewGrid.appendChild(wrapper);
//     });

//     for (let file of files) {
//         const wrapper = document.createElement('div');
//         wrapper.className = 'image-preview-item';
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             wrapper.innerHTML = `
//                         <img src="${e.target.result}" alt="New upload" />
//                         <button type="button" class="remove-img" data-file="${file.name}" title="Remove">
//                             <i class="fas fa-times"></i>
//                         </button>
//                     `;
//             wrapper.querySelector('.remove-img').addEventListener('click', function () {
//                 const currentFiles = Array.from(imageFilesInput.files);
//                 const filtered = currentFiles.filter(f => f.name !== this.dataset.file);
//                 const dataTransfer = new DataTransfer();
//                 filtered.forEach(f => dataTransfer.items.add(f));
//                 imageFilesInput.files = dataTransfer.files;
//                 renderImagePreviews(Array.from(imageFilesInput.files), getCurrentExistingImages());
//                 updateUploadStatus();
//             });
//         };
//         reader.readAsDataURL(file);
//         imagePreviewGrid.appendChild(wrapper);
//     }
//     updateUploadStatus();
// }

// function getCurrentExistingImages() {
//     const existing = document.getElementById('pExistingImages').value;
//     return existing ? existing.split(',') : [];
// }

// function setExistingImages(urls) {
//     document.getElementById('pExistingImages').value = urls.join(',');
// }

// function removeExistingImage(url) {
//     let existing = getCurrentExistingImages();
//     existing = existing.filter(u => u !== url);
//     setExistingImages(existing);
//     renderImagePreviews(Array.from(imageFilesInput.files), existing);
// }

// function updateUploadStatus() {
//     const total = getCurrentExistingImages().length + imageFilesInput.files.length;
//     if (total === 0) {
//         imageUploadStatus.textContent = 'No images selected. Please upload at least one.';
//         imageUploadStatus.className = 'image-upload-status error';
//     } else {
//         imageUploadStatus.textContent = `${total} image(s) ready (max 3)`;
//         imageUploadStatus.className = 'image-upload-status success';
//     }
// }

// imageFilesInput.addEventListener('change', function () {
//     const files = Array.from(this.files);
//     if (files.length + getCurrentExistingImages().length > 3) {
//         alert('You can upload a maximum of 3 images.');
//         this.value = '';
//         return;
//     }
//     renderImagePreviews(files, getCurrentExistingImages());
// });

// function populateExistingImages(urls) {
//     if (!urls) urls = [];
//     setExistingImages(urls);
//     renderImagePreviews([], urls);
// }

// // ============================================================
// //  STOCK TOGGLE
// // ============================================================
// function toggleStock() {
//     const toggle = document.getElementById('stockToggle');
//     const hidden = document.getElementById('pInStock');
//     const label = document.getElementById('stockLabel');
//     const isActive = toggle.classList.toggle('active');
//     hidden.value = isActive ? 'true' : 'false';
//     label.textContent = isActive ? 'Yes, available' : 'No, out of stock';
// }

// // ============================================================
// //  WEIGHT OPTIONS
// // ============================================================
// function addWeightRow(label = '', price = '') {
//     const row = document.createElement('div');
//     row.className = 'weight-row';
//     row.innerHTML = `
//                 <input type="text" class="weight-label" placeholder="e.g. 1 Kg" value="${label}">
//                 <input type="number" class="weight-price" placeholder="Price (₹)" min="0" step="0.01" value="${price}">
//                 <button type="button" class="btn-icon-remove" title="Remove" onclick="this.closest('.weight-row').remove()">
//                 <i class="fas fa-trash-alt"></i>
//                 </button>
//             `;
//     document.getElementById('weightOptionsList').appendChild(row);
// }

// function getWeightOptions() {
//     return [...document.querySelectorAll('#weightOptionsList .weight-row')]
//         .map(row => ({
//             label: row.querySelector('.weight-label').value.trim(),
//             price: parseFloat(row.querySelector('.weight-price').value),
//         }))
//         .filter(w => w.label && !isNaN(w.price));
// }

// function setWeightOptions(options = []) {
//     const container = document.getElementById('weightOptionsList');
//     container.innerHTML = '';
//     if (!options.length) { addWeightRow(); return; }
//     options.forEach(w => addWeightRow(w.label, w.price));
// }

// // ============================================================
// //  MODAL OPEN / EDIT
// // ============================================================
// function openProductModal(data = null) {
//     const isEdit = !!data;
//     document.getElementById('productModalTitle').innerHTML =
//         `<i class="fas fa-box"></i> ${isEdit ? 'Edit Product' : 'Add Product'}`;
//     document.getElementById('productId').value = data?._id || '';
//     document.getElementById('pName').value = data?.name || '';
//     document.getElementById('pDesc').value = data?.description || '';
//     document.getElementById('pPrice').value = data?.price || '';
//     document.getElementById('pCategory').value = data?.category || 'millet';
//     document.getElementById('pFeatures').value = listToText(data?.features);
//     document.getElementById('pIngredients').value = listToText(data?.ingredients);
//     document.getElementById('pBenefits').value = listToText(data?.benefits);

//     const inStock = data?.inStock !== undefined ? data.inStock : true;
//     const toggle = document.getElementById('stockToggle');
//     const hidden = document.getElementById('pInStock');
//     const label = document.getElementById('stockLabel');
//     if (inStock) {
//         toggle.classList.add('active');
//         hidden.value = 'true';
//         label.textContent = 'Yes, available';
//     } else {
//         toggle.classList.remove('active');
//         hidden.value = 'false';
//         label.textContent = 'No, out of stock';
//     }

//     const images = data?.images || (data?.image ? [data.image] : []);
//     populateExistingImages(images);
//     imageFilesInput.value = '';

//     setWeightOptions(data?.weightOptions || []);
//     openModal('productModal');
// }

// async function editProduct(id) {
//     try {
//         const res = await apiFetch('/api/products/' + id);
//         if (!res.ok) throw new Error('Product not found');
//         const data = await safeJson(res);
//         openProductModal(data);
//     } catch (e) {
//         showToast('Error loading product: ' + e.message, true);
//         console.error(e);
//     }
// }

// // ------------------------------------------------------------
// //  Helper: mirrors AUTH.authFetch exactly (same base URL,
// //  same credentials:'include'), but WITHOUT forcing
// //  Content-Type: application/json, so it's safe to use with
// //  FormData (the browser sets the multipart boundary itself).
// // ------------------------------------------------------------
// async function authedFormFetch(path, options = {}) {
//     const token = getAuthToken(); // re-read token at call time, not stale
//     if (!token) {
//         throw new Error('You are not logged in (no auth token found). Please log in again.');
//     }
//     const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
//     const res = await fetch(url, {
//         ...options,
//         headers: {
//             ...(options.headers || {}),
//             Authorization: `Bearer ${token}`,
//         },
//         credentials: 'include', // match AUTH.authFetch so any session cookie is sent too
//     });

//     if (res.status === 401) {
//         // Same behavior as AUTH.authFetch: clear session and bounce to login
//         AUTH.logout();
//         if (!window.location.pathname.includes('login.html')) {
//             window.location.href = 'login.html';
//         }
//     }

//     return res;
// }

// document.getElementById('productForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const id = document.getElementById('productId').value;
//     const saveBtn = document.getElementById('productSaveBtn');

//     const existingImages = getCurrentExistingImages();
//     const newFiles = Array.from(imageFilesInput.files);

//     if (existingImages.length === 0 && newFiles.length === 0) {
//         imageUploadStatus.textContent = 'Please add at least one product image.';
//         imageUploadStatus.className = 'image-upload-status error';
//         return;
//     }

//     const total = existingImages.length + newFiles.length;
//     if (total > 3) {
//         imageUploadStatus.textContent = `You have ${total} images, maximum is 3.`;
//         imageUploadStatus.className = 'image-upload-status error';
//         return;
//     }

//     const formData = new FormData();
//     const fields = {
//         name: document.getElementById('pName').value.trim(),
//         description: document.getElementById('pDesc').value.trim(),
//         price: document.getElementById('pPrice').value,
//         category: document.getElementById('pCategory').value,
//         features: JSON.stringify(textToList(document.getElementById('pFeatures').value)),
//         ingredients: JSON.stringify(textToList(document.getElementById('pIngredients').value)),
//         benefits: JSON.stringify(textToList(document.getElementById('pBenefits').value)),
//         inStock: document.getElementById('pInStock').value,
//         weightOptions: JSON.stringify(getWeightOptions()),
//     };
//     Object.keys(fields).forEach(key => formData.append(key, fields[key]));
//     formData.append('existingImages', JSON.stringify(existingImages));
//     newFiles.forEach(file => formData.append('images', file));

//     saveBtn.disabled = true;
//     saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

//     try {
//         const path = id ? `/api/products/${id}` : `/api/products`;
//         const method = id ? 'PUT' : 'POST';

//         const finalRes = await authedFormFetch(path, {
//             method,
//             body: formData,
//         });

//         if (!finalRes.ok) {
//             const errData = await finalRes.json().catch(() => ({}));
//             if (finalRes.status === 401) {
//                 throw new Error(errData.message || 'Your session has expired. Please log in again.');
//             }
//             if (finalRes.status === 403) {
//                 throw new Error(errData.message || 'Not authorized as admin. Your account may not have admin rights.');
//             }
//             throw new Error(errData.message || `HTTP ${finalRes.status}`);
//         }

//         showToast(id ? 'Product updated' : 'Product created');
//         closeModal('productModal');
//         loadProducts();
//         loadNavCounts();
//     } catch (e) {
//         showToast('Error saving product: ' + e.message, true);
//         console.error(e);
//     } finally {
//         saveBtn.disabled = false;
//         saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
//     }
// });

// // ============================================================
// //  LOAD / DELETE
// // ============================================================
// async function loadProducts() {
//     try {
//         const res = await apiFetch('/api/products');
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
//         const data = await safeJson(res);
//         const tbody = document.getElementById('productsTableBody');
//         if (!data.length) {
//             tbody.innerHTML =
//                 `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-box-open"></i> No products found</div></td></tr>`;
//             return;
//         }
//         tbody.innerHTML = data.map(p => {
//             const img = p.image || (p.images && p.images.length ? p.images[0] : null);
//             const imgUrl = img ? getImageUrl(img) : null;
//             return `
//                         <tr>
//                             <td>${imgUrl ? `<img src="${imgUrl}" alt="${p.name}" class="product-thumb" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'product-thumb-placeholder\\'><i class=\\'fas fa-image\\'></i></div>';" />` : '<div class="product-thumb-placeholder"><i class="fas fa-image"></i></div>'}</td>
//                             <td class="font-medium">${p.name}</td>
//                             <td>₹${p.price}</td>
//                             <td><span style="background:#fef3e2;color:#8a5a2a;padding:0.1rem 0.6rem;border-radius:999px;font-size:0.65rem;">${p.category}</span></td>
//                             <td>${p.inStock ? '<span style="color:#5F7A4F;"><i class="fas fa-check-circle"></i> In Stock</span>' : '<span style="color:#dc2626;"><i class="fas fa-times-circle"></i> Out of Stock</span>'}</td>
//                             <td>
//                             <div class="actions-cell">
//                                 <button class="btn-edit" onclick="editProduct('${p._id}')"><i class="fas fa-edit"></i></button>
//                                 <button class="btn-danger" onclick="deleteProduct('${p._id}')"><i class="fas fa-trash-alt"></i></button>
//                             </div>
//                             </td>
//                         </tr>
//                     `}).join('');
//     } catch (e) {
//         showToast('Failed to load products: ' + e.message, true);
//         console.error(e);
//     }
// }

// async function deleteProduct(id) {
//     if (!confirm('Delete this product?')) return;
//     try {
//         const res = await apiFetch('/api/products/' + id, { method: 'DELETE' });
//         if (!res.ok) throw new Error('Delete failed');
//         showToast('Product deleted');
//         loadProducts();
//         loadNavCounts();
//     } catch (e) {
//         showToast('Error deleting product: ' + e.message, true);
//         console.error(e);
//     }
// }

// window.openProductModal = openProductModal;
// window.editProduct = editProduct;
// window.deleteProduct = deleteProduct;
// window.toggleStock = toggleStock;
// window.addWeightRow = addWeightRow;











// ============================================================
//  Products page logic
// ============================================================

(function init() {
    const user = initAdminShell('products');
    if (!user) return;
    injectCustomCategories();
    renderCategoryManageList();
    loadProducts();
    if (new URLSearchParams(window.location.search).get('new') === '1') {
        openProductModal();
    }
})();

// ============================================================
//  CLIENT-MANAGEABLE CATEGORIES
//  Lets a non-technical admin add (or remove) product categories
//  from the UI, with no code changes needed. Saved in this
//  browser's localStorage, so it's specific to this device/admin
//  login unless/until it's wired up to a real backend endpoint.
// ============================================================
const CUSTOM_CATEGORY_STORAGE_KEY = 'nicy_admin_custom_categories';

function slugifyCategory(text) {
    return String(text || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u0900-\u097F]+/g, '-') // keep letters/numbers + Devanagari, rest -> hyphen
        .replace(/^-+|-+$/g, '');
}

function getCustomCategories() {
    try {
        const raw = JSON.parse(localStorage.getItem(CUSTOM_CATEGORY_STORAGE_KEY) || '[]');
        return Array.isArray(raw) ? raw : [];
    } catch (e) { return []; }
}

function saveCustomCategories(list) {
    localStorage.setItem(CUSTOM_CATEGORY_STORAGE_KEY, JSON.stringify(list));
}

function getAllKnownCategoryValues() {
    const select = document.getElementById('pCategory');
    const values = [];
    select.querySelectorAll('option').forEach(opt => {
        if (opt.value && opt.value !== '__add_new__') values.push(opt.value);
    });
    return values;
}

// Rebuilds the <optgroup id="customCategoryOptions"> inside the Category
// dropdown from whatever is currently saved in localStorage. Safe to call
// any time (e.g. right after adding/removing a category).
function injectCustomCategories(selectedValue) {
    const select = document.getElementById('pCategory');
    const group = document.getElementById('customCategoryOptions');
    if (!select || !group) return;

    const prev = selectedValue !== undefined ? selectedValue : select.value;
    group.innerHTML = '';
    getCustomCategories().forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.value;
        opt.textContent = cat.label;
        group.appendChild(opt);
    });

    if (prev && getAllKnownCategoryValues().includes(prev)) {
        select.value = prev;
    }
}

// If a product was saved (maybe from a different browser/admin) with a
// category value that isn't in this browser's list yet, register it here
// too so the dropdown can display it correctly instead of silently
// falling back to something else.
function ensureCategoryOptionExists(value, label) {
    if (!value) return;
    if (getAllKnownCategoryValues().includes(value)) return;
    const list = getCustomCategories();
    if (!list.some(c => c.value === value)) {
        list.push({ value, label: label || value });
        saveCustomCategories(list);
    }
    injectCustomCategories(value);
}

function renderCategoryManageList() {
    const wrap = document.getElementById('customCategoryManageList');
    if (!wrap) return;
    const list = getCustomCategories();
    if (!list.length) {
        wrap.innerHTML = '<p class="custom-cat-empty">No custom categories added yet.</p>';
        return;
    }
    wrap.innerHTML = list.map(cat => `
        <div class="custom-cat-row">
            <span>${cat.label}<span class="cat-tag-slug">(${cat.value})</span></span>
            <button type="button" title="Remove" onclick="deleteCustomCategory('${cat.value}')"><i class="fas fa-times"></i></button>
        </div>
    `).join('');
}

function addCustomCategory() {
    const input = document.getElementById('newCategoryName');
    const statusEl = document.getElementById('categoryAddStatus');
    const label = input.value.trim();

    if (!label) {
        statusEl.textContent = 'Please type a category name.';
        statusEl.className = 'image-upload-status error';
        return;
    }

    const slug = slugifyCategory(label);
    if (!slug) {
        statusEl.textContent = 'That name could not be converted into a valid category. Try letters/numbers.';
        statusEl.className = 'image-upload-status error';
        return;
    }
    if (getAllKnownCategoryValues().includes(slug)) {
        statusEl.textContent = 'A category with that name already exists.';
        statusEl.className = 'image-upload-status error';
        return;
    }

    const list = getCustomCategories();
    list.push({ value: slug, label });
    saveCustomCategories(list);
    injectCustomCategories(slug);
    renderCategoryManageList();

    input.value = '';
    document.getElementById('newCategorySlugPreview').textContent = '—';
    statusEl.textContent = `"${label}" added! It's now available in the Category dropdown.`;
    statusEl.className = 'image-upload-status success';
    showToast('Category added: ' + label);
}

function deleteCustomCategory(value) {
    if (!confirm('Remove this category? Products already saved with it will keep the value, but it will no longer appear in the dropdown for new products.')) return;
    let list = getCustomCategories();
    list = list.filter(c => c.value !== value);
    saveCustomCategories(list);

    const select = document.getElementById('pCategory');
    const wasSelected = select.value === value;
    injectCustomCategories(wasSelected ? 'millet' : undefined);
    renderCategoryManageList();
    showToast('Category removed');
}

function openCategoryModal() {
    renderCategoryManageList();
    const input = document.getElementById('newCategoryName');
    input.value = '';
    document.getElementById('newCategorySlugPreview').textContent = '—';
    document.getElementById('categoryAddStatus').textContent = '';
    document.getElementById('categoryAddStatus').className = 'image-upload-status';
    openModal('categoryModal');
    setTimeout(() => input.focus(), 150);
}

// Live slug preview as the client types a new category name
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('newCategoryName');
    if (input) {
        input.addEventListener('input', () => {
            const preview = document.getElementById('newCategorySlugPreview');
            preview.textContent = slugifyCategory(input.value) || '—';
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); addCustomCategory(); }
        });
    }

    // "+ Add New Category…" trigger inside the Product form's Category select
    const categorySelect = document.getElementById('pCategory');
    if (categorySelect) {
        let lastRealValue = categorySelect.value;
        categorySelect.addEventListener('change', () => {
            if (categorySelect.value === '__add_new__') {
                categorySelect.value = lastRealValue; // revert until they actually add one
                openCategoryModal();
            } else {
                lastRealValue = categorySelect.value;
            }
        });
    }
});

window.openCategoryModal = openCategoryModal;
window.addCustomCategory = addCustomCategory;
window.deleteCustomCategory = deleteCustomCategory;

// ============================================================
//  MULTI-IMAGE HANDLING
// ============================================================
const imageFilesInput = document.getElementById('pImageFiles');
const imagePreviewGrid = document.getElementById('imagePreviewGrid');
const imageUploadStatus = document.getElementById('imageUploadStatus');
const pExistingImages = document.getElementById('pExistingImages');

function renderImagePreviews(files = [], existingUrls = []) {
    imagePreviewGrid.innerHTML = '';
    existingUrls.forEach((url, index) => {
        const fullUrl = getImageUrl(url);
        if (!fullUrl) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'image-preview-item';
        wrapper.innerHTML = `
                    <img src="${fullUrl}" alt="Product image ${index + 1}" onerror="this.style.display='none';this.parentElement.querySelector('.img-fallback').style.display='flex';" />
                    <div class="img-fallback" style="display:none;width:100%;height:100%;background:#f8f2ea;align-items:center;justify-content:center;color:#cbb9ab;font-size:0.7rem;flex-direction:column;"><i class="fas fa-image"></i><span style="font-size:0.5rem;">${url.split('/').pop().slice(0, 10)}</span></div>
                    <button type="button" class="remove-img" data-url="${url}" title="Remove image">
                        <i class="fas fa-times"></i>
                    </button>
                `;
        wrapper.querySelector('.remove-img').addEventListener('click', function (e) {
            e.stopPropagation();
            removeExistingImage(this.dataset.url);
        });
        imagePreviewGrid.appendChild(wrapper);
    });

    for (let file of files) {
        const wrapper = document.createElement('div');
        wrapper.className = 'image-preview-item';
        const reader = new FileReader();
        reader.onload = function (e) {
            wrapper.innerHTML = `
                        <img src="${e.target.result}" alt="New upload" />
                        <button type="button" class="remove-img" data-file="${file.name}" title="Remove">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
            wrapper.querySelector('.remove-img').addEventListener('click', function () {
                const currentFiles = Array.from(imageFilesInput.files);
                const filtered = currentFiles.filter(f => f.name !== this.dataset.file);
                const dataTransfer = new DataTransfer();
                filtered.forEach(f => dataTransfer.items.add(f));
                imageFilesInput.files = dataTransfer.files;
                renderImagePreviews(Array.from(imageFilesInput.files), getCurrentExistingImages());
                updateUploadStatus();
            });
        };
        reader.readAsDataURL(file);
        imagePreviewGrid.appendChild(wrapper);
    }
    updateUploadStatus();
}

function getCurrentExistingImages() {
    const existing = document.getElementById('pExistingImages').value;
    return existing ? existing.split(',') : [];
}

function setExistingImages(urls) {
    document.getElementById('pExistingImages').value = urls.join(',');
}

function removeExistingImage(url) {
    let existing = getCurrentExistingImages();
    existing = existing.filter(u => u !== url);
    setExistingImages(existing);
    renderImagePreviews(Array.from(imageFilesInput.files), existing);
}

function updateUploadStatus() {
    const total = getCurrentExistingImages().length + imageFilesInput.files.length;
    if (total === 0) {
        imageUploadStatus.textContent = 'No images selected. Please upload at least one.';
        imageUploadStatus.className = 'image-upload-status error';
    } else {
        imageUploadStatus.textContent = `${total} image(s) ready (max 3)`;
        imageUploadStatus.className = 'image-upload-status success';
    }
}

imageFilesInput.addEventListener('change', function () {
    const files = Array.from(this.files);
    if (files.length + getCurrentExistingImages().length > 3) {
        alert('You can upload a maximum of 3 images.');
        this.value = '';
        return;
    }
    renderImagePreviews(files, getCurrentExistingImages());
});

function populateExistingImages(urls) {
    if (!urls) urls = [];
    setExistingImages(urls);
    renderImagePreviews([], urls);
}

// ============================================================
//  STOCK TOGGLE
// ============================================================
function toggleStock() {
    const toggle = document.getElementById('stockToggle');
    const hidden = document.getElementById('pInStock');
    const label = document.getElementById('stockLabel');
    const isActive = toggle.classList.toggle('active');
    hidden.value = isActive ? 'true' : 'false';
    label.textContent = isActive ? 'Yes, available' : 'No, out of stock';
}

// ============================================================
//  WEIGHT OPTIONS
// ============================================================
function addWeightRow(label = '', price = '') {
    const row = document.createElement('div');
    row.className = 'weight-row';
    row.innerHTML = `
                <input type="text" class="weight-label" placeholder="e.g. 1 Kg" value="${label}">
                <input type="number" class="weight-price" placeholder="Price (₹)" min="0" step="0.01" value="${price}">
                <button type="button" class="btn-icon-remove" title="Remove" onclick="this.closest('.weight-row').remove()">
                <i class="fas fa-trash-alt"></i>
                </button>
            `;
    document.getElementById('weightOptionsList').appendChild(row);
}

function getWeightOptions() {
    return [...document.querySelectorAll('#weightOptionsList .weight-row')]
        .map(row => ({
            label: row.querySelector('.weight-label').value.trim(),
            price: parseFloat(row.querySelector('.weight-price').value),
        }))
        .filter(w => w.label && !isNaN(w.price));
}

function setWeightOptions(options = []) {
    const container = document.getElementById('weightOptionsList');
    container.innerHTML = '';
    if (!options.length) { addWeightRow(); return; }
    options.forEach(w => addWeightRow(w.label, w.price));
}

// ============================================================
//  MODAL OPEN / EDIT
// ============================================================
function openProductModal(data = null) {
    const isEdit = !!data;
    document.getElementById('productModalTitle').innerHTML =
        `<i class="fas fa-box"></i> ${isEdit ? 'Edit Product' : 'Add Product'}`;
    document.getElementById('productId').value = data?._id || '';
    document.getElementById('pName').value = data?.name || '';
    document.getElementById('pDesc').value = data?.description || '';
    document.getElementById('pPrice').value = data?.price || '';

    injectCustomCategories(); // make sure any client-added categories are in the dropdown
    const desiredCategory = data?.category || 'millet';
    ensureCategoryOptionExists(desiredCategory, desiredCategory);
    document.getElementById('pCategory').value = desiredCategory;

    document.getElementById('pFeatures').value = listToText(data?.features);
    document.getElementById('pIngredients').value = listToText(data?.ingredients);
    document.getElementById('pBenefits').value = listToText(data?.benefits);

    const inStock = data?.inStock !== undefined ? data.inStock : true;
    const toggle = document.getElementById('stockToggle');
    const hidden = document.getElementById('pInStock');
    const label = document.getElementById('stockLabel');
    if (inStock) {
        toggle.classList.add('active');
        hidden.value = 'true';
        label.textContent = 'Yes, available';
    } else {
        toggle.classList.remove('active');
        hidden.value = 'false';
        label.textContent = 'No, out of stock';
    }

    const images = data?.images || (data?.image ? [data.image] : []);
    populateExistingImages(images);
    imageFilesInput.value = '';

    setWeightOptions(data?.weightOptions || []);
    openModal('productModal');
}

async function editProduct(id) {
    try {
        const res = await apiFetch('/api/products/' + id);
        if (!res.ok) throw new Error('Product not found');
        const data = await safeJson(res);
        openProductModal(data);
    } catch (e) {
        showToast('Error loading product: ' + e.message, true);
        console.error(e);
    }
}

// ------------------------------------------------------------
//  Helper: mirrors AUTH.authFetch exactly (same base URL,
//  same credentials:'include'), but WITHOUT forcing
//  Content-Type: application/json, so it's safe to use with
//  FormData (the browser sets the multipart boundary itself).
// ------------------------------------------------------------
async function authedFormFetch(path, options = {}) {
    const token = getAuthToken(); // re-read token at call time, not stale
    if (!token) {
        throw new Error('You are not logged in (no auth token found). Please log in again.');
    }
    const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
        credentials: 'include', // match AUTH.authFetch so any session cookie is sent too
    });

    if (res.status === 401) {
        // Same behavior as AUTH.authFetch: clear session and bounce to login
        AUTH.logout();
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    return res;
}

document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const saveBtn = document.getElementById('productSaveBtn');

    const existingImages = getCurrentExistingImages();
    const newFiles = Array.from(imageFilesInput.files);

    if (existingImages.length === 0 && newFiles.length === 0) {
        imageUploadStatus.textContent = 'Please add at least one product image.';
        imageUploadStatus.className = 'image-upload-status error';
        return;
    }

    const total = existingImages.length + newFiles.length;
    if (total > 3) {
        imageUploadStatus.textContent = `You have ${total} images, maximum is 3.`;
        imageUploadStatus.className = 'image-upload-status error';
        return;
    }

    const formData = new FormData();
    const fields = {
        name: document.getElementById('pName').value.trim(),
        description: document.getElementById('pDesc').value.trim(),
        price: document.getElementById('pPrice').value,
        category: document.getElementById('pCategory').value,
        features: JSON.stringify(textToList(document.getElementById('pFeatures').value)),
        ingredients: JSON.stringify(textToList(document.getElementById('pIngredients').value)),
        benefits: JSON.stringify(textToList(document.getElementById('pBenefits').value)),
        inStock: document.getElementById('pInStock').value,
        weightOptions: JSON.stringify(getWeightOptions()),
    };
    Object.keys(fields).forEach(key => formData.append(key, fields[key]));
    formData.append('existingImages', JSON.stringify(existingImages));
    newFiles.forEach(file => formData.append('images', file));

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

    try {
        const path = id ? `/api/products/${id}` : `/api/products`;
        const method = id ? 'PUT' : 'POST';

        const finalRes = await authedFormFetch(path, {
            method,
            body: formData,
        });

        if (!finalRes.ok) {
            const errData = await finalRes.json().catch(() => ({}));
            if (finalRes.status === 401) {
                throw new Error(errData.message || 'Your session has expired. Please log in again.');
            }
            if (finalRes.status === 403) {
                throw new Error(errData.message || 'Not authorized as admin. Your account may not have admin rights.');
            }
            throw new Error(errData.message || `HTTP ${finalRes.status}`);
        }

        showToast(id ? 'Product updated' : 'Product created');
        closeModal('productModal');
        loadProducts();
        loadNavCounts();
    } catch (e) {
        showToast('Error saving product: ' + e.message, true);
        console.error(e);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Product';
    }
});

// ============================================================
//  LOAD / DELETE
// ============================================================
async function loadProducts() {
    try {
        const res = await apiFetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await safeJson(res);
        const tbody = document.getElementById('productsTableBody');
        if (!data.length) {
            tbody.innerHTML =
                `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-box-open"></i> No products found</div></td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(p => {
            const img = p.image || (p.images && p.images.length ? p.images[0] : null);
            const imgUrl = img ? getImageUrl(img) : null;
            return `
                        <tr>
                            <td>${imgUrl ? `<img src="${imgUrl}" alt="${p.name}" class="product-thumb" onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'product-thumb-placeholder\\'><i class=\\'fas fa-image\\'></i></div>';" />` : '<div class="product-thumb-placeholder"><i class="fas fa-image"></i></div>'}</td>
                            <td class="font-medium">${p.name}</td>
                            <td>₹${p.price}</td>
                            <td><span style="background:#fef3e2;color:#8a5a2a;padding:0.1rem 0.6rem;border-radius:999px;font-size:0.65rem;">${p.category}</span></td>
                            <td>${p.inStock ? '<span style="color:#5F7A4F;"><i class="fas fa-check-circle"></i> In Stock</span>' : '<span style="color:#dc2626;"><i class="fas fa-times-circle"></i> Out of Stock</span>'}</td>
                            <td>
                            <div class="actions-cell">
                                <button class="btn-edit" onclick="editProduct('${p._id}')"><i class="fas fa-edit"></i></button>
                                <button class="btn-danger" onclick="deleteProduct('${p._id}')"><i class="fas fa-trash-alt"></i></button>
                            </div>
                            </td>
                        </tr>
                    `}).join('');
    } catch (e) {
        showToast('Failed to load products: ' + e.message, true);
        console.error(e);
    }
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
        const res = await apiFetch('/api/products/' + id, { method: 'DELETE' });
        if (!res.ok) throw new Error('Delete failed');
        showToast('Product deleted');
        loadProducts();
        loadNavCounts();
    } catch (e) {
        showToast('Error deleting product: ' + e.message, true);
        console.error(e);
    }
}

window.openProductModal = openProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.toggleStock = toggleStock;
window.addWeightRow = addWeightRow;