const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

const PRODUCTS_URL = "./products.json"; // zelfde repo, relatief pad

let allProducts = [];
let activeCategory = "Alle";

const grid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const modal = document.getElementById("productModal");
const modalMedia = document.getElementById("modalMedia");
const modalName = document.getElementById("modalName");
const modalDescription = document.getElementById("modalDescription");
const modalQuantities = document.getElementById("modalQuantities");

function formatPrice(price, currency) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: currency || "EUR" }).format(price);
}

function isVideo(url) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("/video/upload/");
}

async function loadProducts() {
  try {
    const res = await fetch(PRODUCTS_URL + "?t=" + Date.now());
    const data = await res.json();
    allProducts = (data.products || []).filter(p => p.active !== false);
    renderCategories(data.categories || []);
    renderGrid();
  } catch (err) {
    grid.innerHTML = `<div class="loading">Kon producten niet laden.</div>`;
    console.error(err);
  }
}

function renderCategories(categories) {
  const cats = ["Alle", ...categories];
  categoryFilter.innerHTML = "";
  cats.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "category-chip" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat;
    btn.onclick = () => {
      activeCategory = cat;
      renderCategories(categories);
      renderGrid();
    };
    categoryFilter.appendChild(btn);
  });
}

function renderGrid() {
  const filtered = activeCategory === "Alle"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="loading">Geen producten in deze categorie.</div>`;
    return;
  }

  grid.innerHTML = "";
  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    const thumb = product.images?.[0] || "";
    card.innerHTML = `
      <img class="thumb" src="${thumb}" alt="${product.name}" loading="lazy">
      <div class="info">
        <p class="name">${product.name}</p>
        <p class="price">${formatPrice(product.price, product.currency)}</p>
      </div>
    `;
    card.onclick = () => openProduct(product);
    grid.appendChild(card);
  });
}

function openProduct(product) {
  modalName.textContent = product.name;
  modalDescription.textContent = product.description || "";

  modalMedia.innerHTML = "";
  const mediaItems = [...(product.images || []), ...(product.videos || [])];
  mediaItems.forEach(url => {
    if (isVideo(url)) {
      const video = document.createElement("video");
      video.src = url;
      video.controls = true;
      video.playsInline = true;
      modalMedia.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = url;
      img.alt = product.name;
      modalMedia.appendChild(img);
    }
  });

  modalQuantities.innerHTML = "";
  const quantities = product.quantities?.length
    ? product.quantities
    : [{ label: `1 ${product.unit || "stuk"}`, amount: 1, price: product.price }];

  quantities.forEach(q => {
    const row = document.createElement("div");
    row.className = "quantity-row";
    row.innerHTML = `<span>${q.label}</span><span class="qty-price">${formatPrice(q.price, product.currency)}</span>`;
    modalQuantities.appendChild(row);
  });

  modal.classList.remove("hidden");
}

document.getElementById("closeModal").onclick = () => modal.classList.add("hidden");
modal.onclick = (e) => { if (e.target === modal) modal.classList.add("hidden"); };

loadProducts();
