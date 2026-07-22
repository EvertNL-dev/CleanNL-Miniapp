# Keuken Webshop — Telegram Bot + Mini App

Drie onderdelen:

1. **`webapp/`** — de Telegram Mini App (statisch, draait op GitHub Pages). Laat producten zien met prijzen, hoeveelheden, foto's en video's (via Cloudinary).
2. **`admin/`** — admin panel (ook statisch, ook GitHub Pages). Bewerkt `webapp/products.json` rechtstreeks via de GitHub API.
3. **`bot/`** — de Telegram bot zelf (Node.js). Moet los draaien op een server, GitHub Pages kan dit niet hosten omdat het static hosting is.

---

## 1. Cloudinary instellen (foto's & video's)

1. Maak een gratis account op [cloudinary.com](https://cloudinary.com).
2. Upload je product-foto's en video's via het Cloudinary dashboard (Media Library).
3. Kopieer per bestand de **secure URL** (rechtsklik → copy, of klik op het bestand → "Copy URL"). Ziet er zo uit:
   - Foto: `https://res.cloudinary.com/JOUW_CLOUD_NAME/image/upload/v123456/product1.jpg`
   - Video: `https://res.cloudinary.com/JOUW_CLOUD_NAME/video/upload/v123456/product1.mp4`
4. Deze URLs plak je straks in het admin panel bij het aanmaken/bewerken van een product.

> Tip: maak in Cloudinary een folder per product zodat het overzichtelijk blijft.

---

## 2. Repository op GitHub zetten

1. Maak een nieuwe **publieke** GitHub repository, bv. `keuken-webshop`.
2. Push deze hele projectmap (min. de `webapp/` en `admin/` mappen) naar die repo.
3. Ga naar **Settings → Pages** in de repo.
4. Kies branch `main`, map `/ (root)`, en sla op.
5. Na een paar minuten is je site live op:
   - Mini-app: `https://JOUW-USERNAME.github.io/keuken-webshop/webapp/`
   - Admin panel: `https://JOUW-USERNAME.github.io/keuken-webshop/admin/`

---

## 3. Admin panel gebruiken

Het admin panel schrijft wijzigingen direct terug naar `webapp/products.json` in je GitHub repo via een commit — er is geen aparte database nodig.

1. Maak een **GitHub Personal Access Token**:
   - Ga naar GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens**.
   - Beperk hem tot alleen jouw `keuken-webshop` repository.
   - Geef **Contents: Read and write** rechten.
   - Genereer en kopieer de token (je ziet 'm maar één keer).
2. Open het admin panel in je browser, vul je GitHub gebruikersnaam, repo-naam, branch (`main`) en de token in.
3. De token wordt alleen lokaal in je browser (localStorage) bewaard — nooit ergens anders naartoe gestuurd dan naar GitHub's eigen API.
4. Voeg producten toe of bewerk ze; elke opslag = een automatische Git commit.

**Belangrijk over veiligheid:** iedereen die het admin panel opent kan producten wijzigen als ze ook een geldige token invullen. Deel de admin-URL niet publiek en gebruik altijd een token die **alleen** toegang heeft tot deze ene repo, nooit een token met volledige account-rechten.

---

## 4. Telegram bot maken & draaien

1. Praat met [@BotFather](https://t.me/BotFather) op Telegram:
   - `/newbot` → volg de stappen → je krijgt een **bot token**.
   - `/mybots` → kies je bot → **Bot Settings → Menu Button** → stel de webapp-URL in (optioneel, voor een vaste knop naast het tekstveld), of laat de bot het via `/start` sturen (al ingebouwd).
2. Kopieer `bot/.env.example` naar `bot/.env` en vul in:
   ```
   BOT_TOKEN=jouw_bot_token_van_botfather
   WEBAPP_URL=https://JOUW-USERNAME.github.io/keuken-webshop/webapp/
   ```
   Let op: `WEBAPP_URL` **moet** `https://` zijn — Telegram accepteert geen `http://` voor mini-apps.
3. Installeer dependencies en start:
   ```bash
   cd bot
   npm install
   npm start
   ```
4. Stuur `/start` naar je bot in Telegram — je krijgt een knop "🛒 Bekijk producten" die de mini-app opent.

### Waar laat je de bot draaien?
GitHub Pages is alleen statische hosting en kan geen Node.js-proces draaien. Voor de bot zelf heb je iets nodig dat 24/7 een proces kan draaien, bijvoorbeeld (allemaal met gratis tier):
- [Render.com](https://render.com) — "Background Worker", `npm start` als start command.
- [Railway.app](https://railway.app)
- Een eigen VPS met bv. `pm2` om het proces levend te houden.

---

## Structuur

```
project/
├── bot/
│   ├── index.js          → de Telegram bot
│   ├── package.json
│   └── .env.example
├── webapp/                → de Mini App (GitHub Pages)
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── products.json       → productdata (wordt door admin panel bewerkt)
└── admin/                  → het admin panel (GitHub Pages)
    ├── index.html
    ├── style.css
    └── admin.js
```

## Product data formaat (`webapp/products.json`)

```json
{
  "categories": ["Keukengerei", "Opberg & organisatie"],
  "products": [
    {
      "id": "prod_001",
      "name": "Groentesnijder 8-in-1",
      "category": "Keukengerei",
      "price": 14.95,
      "currency": "EUR",
      "unit": "stuk",
      "quantities": [
        { "label": "1 stuk", "amount": 1, "price": 14.95 },
        { "label": "2 stuks", "amount": 2, "price": 24.95 }
      ],
      "description": "Korte productomschrijving.",
      "images": ["https://res.cloudinary.com/.../image1.jpg"],
      "videos": ["https://res.cloudinary.com/.../video1.mp4"],
      "active": true
    }
  ]
}
```

Je hoeft dit bestand nooit met de hand te bewerken — dat doet het admin panel voor je.

## Wat deze versie (nog) niet doet

- Geen bestelfunctie (dit was expliciet niet gevraagd — alleen producten tonen).
- Geen wachtwoordbeveiliging op het admin panel zelf, alleen de GitHub token als toegangscontrole.
- Geen automatische afbeelding-optimalisatie — gebruik Cloudinary's eigen transformatie-URLs (bv. `w_400,q_auto,f_auto`) als je laadtijd wilt verbeteren.
