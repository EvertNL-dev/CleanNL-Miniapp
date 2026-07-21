let adminState;

function createVariantItem(data = { amount:'', price:'' }) {
  const row = document.createElement('div');
  row.className = 'variant-item';
  row.innerHTML = `
    <input type="text" data-key="amount" placeholder="Hoeveelheid, bv. 10 gram" value="${data.amount || ''}">
    <input type="text" data-key="price" placeholder="Prijs, bv. 25" value="${data.price || ''}">
    <button type="button" class="btn-danger">X</button>`;
  row.querySelector('button').addEventListener('click', () => row.remove());
  return row;
}

function createEditor(product = { title:'', description:'', image:'', brand:'', variants:[{ amount:'', price:'' }] }) {
  const box = document.createElement('div');
  box.className = 'editor';
  box.innerHTML = `
    <div class="row-2">
      <div class="field"><input data-key="title" type="text" placeholder="Nieuw product" value="${product.title || ''}"></div>
      <div class="field"><input data-key="brand" type="text" placeholder="Merk / Farm" value="${product.brand || ''}"></div>
    </div>
    <div class="field"><textarea data-key="description" placeholder="Beschrijving">${product.description || ''}</textarea></div>
    <div class="field"><input data-key="image" type="text" placeholder="Afbeelding URL" value="${product.image || ''}"></div>
    <div class="variant-box">
      <h4>Hoeveelheden en prijzen</h4>
      <div class="variant-list"></div>
      <div class="actions" style="margin-top:10px">
        <button type="button" class="btn-secondary add-variant">+ Hoeveelheid toevoegen</button>
      </div>
    </div>
    <div class="actions" style="margin-top:12px">
      <button type="button" class="btn-danger remove-product">Product verwijderen</button>
    </div>`;

  const list = box.querySelector('.variant-list');
  (product.variants || [{ amount:'', price:'' }]).forEach(v => list.appendChild(createVariantItem(v)));
  box.querySelector('.add-variant').addEventListener('click', () => list.appendChild(createVariantItem()));
  box.querySelector('.remove-product').addEventListener('click', () => box.remove());
  return box;
}

function createCategorySection(category = { name:'Nieuwe categorie', products:[] }) {
  const section = document.createElement('section');
  section.className = 'category';
  section.innerHTML = `
    <div class="category-head">
      <input class="category-name" type="text" value="${category.name || ''}" style="font-size:28px;font-weight:700;border:none;background:transparent;width:100%;max-width:420px;">
      <button type="button" class="btn-danger remove-category">Verwijder categorie</button>
    </div>
    <div class="products"></div>
    <div class="actions">
      <button type="button" class="btn-secondary add-product">+ Product toevoegen</button>
    </div>`;

  const products = section.querySelector('.products');
  if ((category.products || []).length) {
    category.products.forEach(product => products.appendChild(createEditor(product)));
  } else {
    const p = document.createElement('p');
    p.className = 'note';
    p.textContent = 'Nog geen producten in deze categorie.';
    products.appendChild(p);
  }

  section.querySelector('.add-product').addEventListener('click', () => {
    const note = products.querySelector('.note');
    if (note) note.remove();
    products.appendChild(createEditor());
  });

  section.querySelector('.remove-category').addEventListener('click', () => section.remove());
  return section;
}

function renderAdmin() {
  const root = document.getElementById('categories');
  root.innerHTML = '';
  (adminState.categories || []).forEach(category => root.appendChild(createCategorySection(category)));
}

function collectState() {
  const categories = [...document.querySelectorAll('#categories .category')].map(section => {
    const name = section.querySelector('.category-name')?.value?.trim() || 'Zonder naam';
    const products = [...section.querySelectorAll('.editor')].map(editor => {
      const variants = [...editor.querySelectorAll('.variant-item')].map(row => ({
        amount: row.querySelector('[data-key="amount"]')?.value?.trim() || '',
        price: row.querySelector('[data-key="price"]')?.value?.trim() || ''
      })).filter(v => v.amount || v.price);

      return {
        title: editor.querySelector('[data-key="title"]')?.value?.trim() || '',
        brand: editor.querySelector('[data-key="brand"]')?.value?.trim() || '',
        description: editor.querySelector('[data-key="description"]')?.value?.trim() || '',
        image: editor.querySelector('[data-key="image"]')?.value?.trim() || '',
        variants
      };
    }).filter(p => p.title || p.description || p.image || p.brand || p.variants.length);

    return { name, products };
  }).filter(c => c.name || c.products.length);

  return {
    user: adminState.user || { name:'Evert', initials:'E' },
    categories
  };
}

document.addEventListener('DOMContentLoaded', () => {
  adminState = window.CleanStore ? window.CleanStore.load() : { user:{name:'Evert',initials:'E'}, categories:[] };
  renderAdmin();

  document.getElementById('addCategory').addEventListener('click', () => {
    document.getElementById('categories').appendChild(createCategorySection({ name:'Nieuwe categorie', products:[] }));
  });

  document.getElementById('save').addEventListener('click', () => {
    const data = collectState();
    if (window.CleanStore) {
      window.CleanStore.save(data);
    }
    adminState = data;
    alert('Opgeslagen. Open miniapp.html om je nieuwe producten te zien.');
  });

  const resetBtn = document.getElementById('resetData');
  if (resetBtn && window.CleanStore) {
    resetBtn.addEventListener('click', () => {
      adminState = window.CleanStore.reset();
      renderAdmin();
      alert('Data teruggezet naar de standaard demo-inhoud.');
    });
  }
});
