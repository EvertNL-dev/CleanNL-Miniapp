<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin - Producten beheren</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="loginScreen" class="login-screen">
  <div class="login-box">
    <h2>Admin login</h2>
    <p class="hint">Log in met een GitHub Personal Access Token (fine-grained, alleen toegang tot deze repo, "Contents: read & write"). De token wordt alleen lokaal in je browser bewaard, nooit verzonden naar iets anders dan GitHub zelf.</p>
    <label>GitHub gebruikersnaam / organisatie</label>
    <input id="ghOwner" placeholder="bijv. jouw-username">
    <label>Repository naam</label>
    <input id="ghRepo" placeholder="bijv. keuken-webshop">
    <label>Branch</label>
    <input id="ghBranch" placeholder="main" value="main">
    <label>Personal Access Token</label>
    <input id="ghToken" type="password" placeholder="ghp_xxxxxxxxxxxx">
    <button id="loginBtn">Inloggen</button>
    <p id="loginError" class="error hidden"></p>
  </div>
</div>

<div id="adminScreen" class="admin-screen hidden">
  <header class="admin-header">
    <h1>Producten beheren</h1>
    <div>
      <button id="addProductBtn" class="btn-primary">+ Nieuw product</button>
      <button id="logoutBtn" class="btn-secondary">Uitloggen</button>
    </div>
  </header>

  <div id="statusMsg" class="status-msg hidden"></div>

  <table class="product-table">
    <thead>
      <tr>
        <th>Foto</th>
        <th>Naam</th>
        <th>Categorie</th>
        <th>Prijs</th>
        <th>Actief</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="productTableBody"></tbody>
  </table>
</div>

<!-- Product edit form -->
<div id="editModal" class="modal hidden">
  <div class="modal-content">
    <h2 id="editTitle">Product bewerken</h2>
    <label>Naam</label>
    <input id="f_name">

    <label>Categorie</label>
    <input id="f_category" placeholder="bijv. Keukengerei">

    <label>Basisprijs</label>
    <input id="f_price" type="number" step="0.01">

    <label>Valuta</label>
    <input id="f_currency" value="EUR">

    <label>Eenheid</label>
    <input id="f_unit" placeholder="stuk / set / kg">

    <label>Beschrijving</label>
    <textarea id="f_description" rows="3"></textarea>

    <label>Cloudinary foto URLs (één per regel)</label>
    <textarea id="f_images" rows="3" placeholder="https://res.cloudinary.com/.../image/upload/..."></textarea>

    <label>Cloudinary video URLs (één per regel)</label>
    <textarea id="f_videos" rows="2" placeholder="https://res.cloudinary.com/.../video/upload/..."></textarea>

    <label>Hoeveelheden / staffelprijzen</label>
    <div id="quantityRows"></div>
    <button id="addQuantityBtn" class="btn-secondary small">+ Hoeveelheid toevoegen</button>

    <label class="checkbox-label">
      <input type="checkbox" id="f_active" checked> Actief (zichtbaar in mini-app)
    </label>

    <div class="modal-actions">
      <button id="saveProductBtn" class="btn-primary">Opslaan</button>
      <button id="deleteProductBtn" class="btn-danger hidden">Verwijderen</button>
      <button id="cancelEditBtn" class="btn-secondary">Annuleren</button>
    </div>
  </div>
</div>

<script src="admin.js"></script>
</body>
</html>
