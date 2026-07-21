let adminState;
const API = 'http://localhost:3001';

async function uploadFile(file) {
  if (!file) return '';
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API}/api/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  const json = await res.json();
  return `${API}${json.url}`;
}

function createVariantItem(data = { amount:'', price:'' }) {
  const row = document.createElement('div');
  row.className = 'variant-item';
  row.innerHTML = `<input type="text" data-key="amount" placeholder="Hoeveelheid" value="${data.amount || ''}"><input type="text" data-key="price" placeholder="Prijs" value="${data.price || ''}"><button type="button" class="btn-danger">X</button>`;
  row.querySelector('button').addEventListener('click', () => row.remove());
  return row;
}

function createEditor(product = { title:'', description:'', image:'', video:'', brand:'', variants:[{ amount:'', price:'' }] }) {
  const box = document.createElement('div');
  box.className = 'editor';
  box.innerHTML = `<div class="row-2"><div class="field"><input data-key="title" type="text" placeholder="Nieuw product" value="${product.title || ''}"></div><div class="field"><input data-key="brand" type="text" placeholder="Merk / Farm" value="${product.brand || ''}"></div></div><div class="field"><textarea data-key="description" placeholder="Beschrijving">${product.description || ''}</textarea></div><div class="field"><label class="file-label">Afbeelding</label><input type="file" class="image-file" accept="image/*"><input type="hidden" data-key="image" value="${product.image || ''}"><img class="media-preview ${product.image ? '' : 'is-empty'}" src="${product.image || ''}" alt="preview"></div><div class="field"><label class="file-label">Video</label><input type="file" class="video-file" accept="video/*"><input type="hidden" data-key="video" value="${product.video || ''}"><video class="media-preview video-preview ${product.video ? '' : 'is-empty'}" controls playsinline ${product.video ? `src="${product.video}"` : ''}></video></div><div class="variant-box"><h4>Hoeveelheden en prijzen</h4><div class="variant-list"></div><div class="actions" style="margin-top:10px"><button type="button" class="btn-secondary add-variant">+ Hoeveelheid toevoegen</button></div></div><div class="actions" style="margin-top:12px"><button type="button" class="btn-danger remove-product">Product verwijderen</button></div>`;
  const list = box.querySelector('.variant-list');
  (product.variants || [{ amount:'', price:'' }]).forEach(v => list.appendChild(createVariantItem(v)));
  box.querySelector('.add-variant').addEventListener('click', () => list.appendChild(createVariantItem()));
  box.querySelector('.remove-product').addEventListener('click', () => box.remove());
  const imgIn = box.querySelector('.image-file');
  const imgHidden = box.querySelector('input[data-key="image"]');
  const imgPrev = box.querySelector('img.media-preview');
  imgIn.addEventListener('change', async () => { const f = imgIn.files[0]; if (!f) return; const url = await uploadFile(f); imgHidden.value = url; imgPrev.src = url; imgPrev.classList.remove('is-empty'); });
  const vidIn = box.querySelector('.video-file');
  const vidHidden = box.querySelector('input[data-key="video"]');
  const vidPrev = box.querySelector('video.video-preview');
  vidIn.addEventListener('change', async () => { const f = vidIn.files[0]; if (!f) return; const url = await uploadFile(f); vidHidden.value = url; vidPrev.src = url; vidPrev.classList.remove('is-empty'); });
  return box;
}

function createCategorySection(category = { name:'Nieuwe categorie', products:[] }) {
  const section = document.createElement('section');
  section.className = 'category';
  section.innerHTML = `<div class="category-head"><input class="category-name" type="text" value="${category.name || ''}" style="font-size:28px;font-weight:700;border:none;background:transparent;width:100%;max-width:420px;"><button type="button" class="btn-danger remove-category">Verwijder categorie</button></div><div class="products"></div><div class="actions"><button type="button" class="btn-secondary add-product">+ Product toevoegen</button></div>`;
  const products = section.querySelector('.products');
  (category.products || []).forEach(product => products.appendChild(createEditor(product)));
  if (!category.products?.length) { const p = document.createElement('p'); p.className = 'note'; p.textContent = 'Nog geen producten in deze categorie.'; products.appendChild(p); }
  section.querySelector('.add-product').addEventListener('click', () => { const note = products.querySelector('.note'); if (note) note.remove(); products.appendChild(createEditor()); });
  section.querySelector('.remove-category').addEventListener('click', () => section.remove());
  return section;
}

function renderAdmin() {
  const root = document.getElementById('categories'); root.innerHTML = ''; (adminState.categories || []).forEach(c => root.appendChild(createCategorySection(c)));
}
function collectState() {
  return { user: adminState.user || { name:'Evert', initials:'E' }, categories: [...document.querySelectorAll('#categories .category')].map(section => ({ name: section.querySelector('.category-name').value.trim() || 'Zonder naam', products: [...section.querySelectorAll('.editor')].map(editor => ({ title: editor.querySelector('[data-key="title"]').value.trim(), brand: editor.querySelector('[data-key="brand"]').value.trim(), description: editor.querySelector('[data-key="description"]').value.trim(), image: editor.querySelector('[data-key="image"]').value.trim(), video: editor.querySelector('[data-key="video"]').value.trim(), variants: [...editor.querySelectorAll('.variant-item')].map(row => ({ amount: row.querySelector('[data-key="amount"]').value.trim(), price: row.querySelector('[data-key="price"]').value.trim() })).filter(v => v.amount || v.price) })).filter(p => p.title || p.description || p.image || p.video || p.brand || p.variants.length) })).filter(c => c.name || c.products.length) };
}

document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch(`${API}/api/products`);
  adminState = await res.json();
  renderAdmin();
  document.getElementById('addCategory').addEventListener('click', () => document.getElementById('categories').appendChild(createCategorySection({ name:'Nieuwe categorie', products:[] })));
  document.getElementById('save').addEventListener('click', async () => { const data = collectState(); await fetch(`${API}/api/products`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); adminState = data; alert('Opgeslagen'); });
  const resetBtn = document.getElementById('resetData'); if (resetBtn) resetBtn.addEventListener('click', () => location.reload());
});
