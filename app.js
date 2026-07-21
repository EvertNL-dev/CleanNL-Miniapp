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

function renderStore(data) {
  const products = flattenProducts(data);
  const grid = document.getElementById('grid');
  const cat = document.getElementById('category');
  const farm = document.getElementById('farm');
  const userName = document.getElementById('userName');
  const initials = document.getElementById('userInitials');

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
      grid.innerHTML = '<p style="grid-column:1/-1;color:#9db1c5">Nog geen producten gevonden.</p>';
      document.getElementById('count').textContent = `0 products`;
      return;
    }

    document.getElementById('count').textContent = `${list.length} products`;

    list.forEach(product => {
      const first = (product.variants || [])[0] || { amount: '-', price: 0 };

      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <img src="${product.image || 'https://picsum.photos/seed/cleannl/600/600'}" alt="${product.title || 'Product'}" loading="lazy">
        <div class="card-body">
          <span class="badge">${product.brand || 'Onbekend'}</span>
          <h3>${product.title || 'Nieuw product'}</h3>
          <div class="variant-row">
            ${(product.variants || []).map((v, i) =>
              `<button class="variant-btn ${i === 0 ? 'active' : ''}" data-price="${v.price}">${v.amount}</button>`
            ).join('')}
          </div>
          <div class="price-row">
            <div>
              <div class="meta">${product.category}</div>
              <div class="price">${euro(first.price)}</div>
            </div>
            <button class="btn-secondary">♡</button>
          </div>
        </div>
      `;

      const price = el.querySelector('.price');
      el.querySelectorAll('.variant-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          el.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          price.textContent = euro(btn.dataset.price);
        });
      });

      grid.appendChild(el);
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
