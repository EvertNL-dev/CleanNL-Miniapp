let adminState;
const API = 'http://localhost:3001';
const STORAGE_KEY = 'cld-products';
const CFG_KEY = 'cld-config';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureStateShape(data) {
  return {
    user: data?.user || { name: 'Evert', initials: 'E' },
    categories: Array.isArray(data?.categories) ? data.categories : []
  };
}

function getCloudConfig() {
  return loadJSON(CFG_KEY, { cloudName: '', uploadPreset: '' });
}

async function uploadFile(file) {
  if (!file) return '';
  const cfg = getCloudConfig();
  if (!cfg.cloudName || !cfg.uploadPreset) throw new Error('Vul cloudName en uploadPreset in');
  const resourceType = file.type?.startsWith('video/') ? 'video' : 'image';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', cfg.uploadPreset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/${resourceType}/upload`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Upload failed');
  return json.secure_url;
}

function createVariantItem(data = { amount: '', price: '' }) {
  const row = document.createElement('div');
  row.className = 'variant-item';
  row.innerHTML = `<input type="text" data-key="amount" placeholder="Hoeveelheid" value="${data.amount || ''}"><input type="text" data-key="price" placeholder="Prijs" value="${data.price || ''}"><button type="button" class="btn-danger">X</button>`;
  row.querySelector('button').addEventListener('click', () => row.remove());
  return row;
}

function createEditor(product = { title: '', description: '', image: '', video: '', brand: '', variants: [{ amount: '', price: '' }] }) {
  const box = document.createElement('div');
  box.className = 'editor';
  box.innerHTML 
