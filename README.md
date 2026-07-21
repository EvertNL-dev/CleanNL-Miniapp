# Keukenwinkel — Mini App + Admin

## Bestanden
- `index.html` — de winkel (categorie-chips + productgrid, mobiel-first)
- `products.json` — je productdata, gestructureerd per categorie
- `admin.html` — beheerpaneel: producten en prijzen aanpassen zonder code

## Bestanden uploaden
Upload alle 3 bestanden naar dezelfde map in je repository (`CleanNL-Miniapp`),
via **Add file → Upload files → Commit changes** — net als eerder.

Je site: `https://evertnl-dev.github.io/CleanNL-Miniapp/`
Je adminpaneel: `https://evertnl-dev.github.io/CleanNL-Miniapp/admin.html`

## Adminpaneel gebruiken
1. Open de admin-URL hierboven
2. Plak je GitHub Personal Access Token (zie stappen die ik je stuurde)
3. Gebruikersnaam en repositorynaam staan al ingevuld — klopt dit niet, pas ze aan
4. Klik **Inloggen & producten laden**
5. Pas namen, beschrijvingen, prijzen en afbeeldings-URL's aan, voeg producten
   of categorieën toe of verwijder ze
6. Klik **Wijzigingen opslaan** — dit commit direct naar GitHub

De site (`index.html`) haalt `products.json` telkens opnieuw op, dus wijzigingen
zijn na een halve tot hele minuut (GitHub Pages rebuild-tijd) live.

## Belangrijk over het token
- Bewaar je token nergens waar anderen bij kunnen — wie het token heeft, kan
  je repository bewerken.
- Het token blijft alleen lokaal in je browser (sessionStorage) staan en
  wordt nergens anders opgeslagen. Sluit je de browsertab, dan moet je 'm
  opnieuw invullen.
- Wil je het adminpaneel niet meer gebruiken vanaf een bepaald apparaat?
  Ga naar GitHub → Settings → Developer settings → Personal access tokens
  en verwijder de token daar.

## Bot koppelen
Dit gaat nog steeds via `bot.py` zoals eerder — de `MINIAPP_URL` blijft
gewoon naar `index.html` wijzen (niet naar `admin.html`, die houd je voor
jezelf).
