function euro(v) {
  return '€' + Number(v || 0).toFixed(2).replace('.00', '');
}

function flattenProducts(data) {
  return (data.categories || []).flatMap(category =>
    (category.products || []).map(product => ({
      ...product,
      category: category.name
    }))
  );
}

function createVariantButtons(variants, onSelect) {
  return (variants || []).map((variant, index) => {
    const button = document.createElement('button');
    button.className = 'variant-btn' + (index === 0 ? ' active' : '');
    button.type = 'button';
    button.textContent = variant.amount || '-';
    button.dataset.price = variant.price || 0;
    button.addEventListener('click', () => onSelect(button, variant));
    return button;
  });
}

function setupModal() {
  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalBrand = document.getElementById('modalBrand');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalCategory = document.getElementById('modalCategory');
  const modalVariants = document.getElementById('modalVariants');
  const modalPrice = document.getElementById('modalPrice');

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function openModal(product) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    modalImage.src = product.image || 'https://picsum.photos/seed/cleannl/900/900';
    modalImage.alt = product.title || 'Product';
    modalBrand.textContent = product.brand || 'Onbekend';
    modalTitle.textContent = product.title || 'Nieuw product';
    modalDescription.textContent = product.description || 'Geen beschrijving beschikbaar.';
    modalCategory.textContent = product.category || 'Onbekende categorie';

    modalVariants.innerHTML = '';
    const variants = product.variants || [];
    const first = variants[0] || { price: 0 };
    modalPrice.textContent = euro(first.price);

    createVariantButtons(variants, (button, variant) => {
      modalVariants.querySelectorAll('.variant-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      modalPrice.textContent = euro(variant.price);
    }).forEach(button => modalVariants.appendChild(button));
  }

  modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  return { openModal, closeModal };
}

function renderStore(data) {
  const products = flattenProducts(data);
  const grid = document.getElementById('grid');
  const cat = document.getElementById('category');
  const farm = document.getElementById('farm');
  const userName = document.getElementById('userName');
  const initials = document.getElementById('userInitials');
  const count = document.getElementById('count');
  const { openModal } = setupModal();

  userName.textContent = data.user?.name || 'Gebruiker';
  initials.textContent = data.user?.initials || 'G';

  const categories = [...new Set(products.map(p => p.category))];
  const farms = [...new Set(products.map(p => p.brand).filter(Boolean))];

  cat.innerHTML = '<option value="">Alle categorieën</option>' +
    categories.map(v => `<option value="${v}">${v}</option>`).join('');

  farm.innerHTML = '<option value="">Alle farms</option>' +
    farms.map(v => `<option value="${v}">${v}</option>`).join('');

  function draw(list) {
    grid.innerHTML = '';

    if (!list.length) {
      count.textContent = '0 products';
      grid.innerHTML = '<p style="grid-column:1/-1;color:#9db1c5">Nog geen producten gevonden.</p>';
      return;
    }

    count.textContent = `${list.length} products`;

    list.forEach(product => {
      const first = (product.variants || [])[0] || { amount: '-', price: 0 };
      const card = document.createElement('article');
      card.className = 'card card--clickable';
      card.tabIndex = 0;
      card.innerHTML = `
        <img src="${product.image || 'https://picsum.photos/seed/cleannl/600/600'}" alt="${product.title || 'Product'}" loading="lazy">
        <div class="card-body">
          <span class="badge">${product.brand || 'Onbekend'}</span>
          <h3>${product.title || 'Nieuw product'}</h3>
          <div class="variant-row">
            ${(product.variants || []).slice(0, 3).map((v, i) =>
              `<button type="button" class="variant-btn ${i === 0 ? 'active' : ''}" data-price="${v.price}">${v.amount}</button>`
            ).join('')}
          </div>
          <div class="price-row">
            <div>
              <div class="meta">${product.category}</div>
              <div class="price">${euro(first.price)}</div>
            </div>
            <button class="btn-secondary" type="button">Bekijk</button>
          </div>
        </div>`;

      card.addEventListener('click', (e) => {
        if (e.target.closest('.variant-btn')) return;
        openModal(product);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(product);
        }
      });

      const price = card.querySelector('.price');
      card.querySelectorAll('.variant-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          card.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          price.textContent = euro(btn.dataset.price);
        });
      });

      card.querySelector('.btn-secondary').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(product);
      });

      grid.appendChild(card);
    });
  }

  function applyFilters() {
    const selectedCategory = cat.value;
    const selectedFarm = farm.value;
    const filtered = products.filter(p =>
      (!selectedCategory || p.category === selectedCategory) &&
      (!selectedFarm || p.brand === selectedFarm)
    );
    draw(filtered);
  }

  cat.onchange = applyFilters;
  farm.onchange = applyFilters;
  draw(products);
}

document.addEventListener('DOMContentLoaded', () => {
  const data = window.CleanStore ? window.CleanStore.load() : { user: {}, categories: [] };
  renderStore(data);
});
