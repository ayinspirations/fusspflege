# Fußpflege & Wellness Leonberg – Redesign

Statische Website (HTML/CSS/JS, kein Build-Schritt) im Stil der übermittelten
Referenzen: warme Nude-/Rosé-Palette, große Bildkacheln, animierte Kacheln, die
beim Scrollen eingeflogen kommen.

## Struktur
```
index.html          Startseite (One-Pager)
impressum.html      Rechtliches (Platzhalter)
datenschutz.html    Rechtliches (Platzhalter)
assets/css/style.css
assets/js/main.js
assets/img/         hier die echten Fotos ablegen
```

## Lokal ansehen
```
python3 -m http.server 8000
```

## Animationen
* `data-tile`  – Kachel fliegt von unten ein (Y-Versatz, Scale, Blur)
* `data-reveal`– Text/Buttons blenden sanft ein
* `style="--d:120ms"` steuert den Stagger-Versatz pro Element
* `prefers-reduced-motion` wird respektiert

## Offene Punkte
1. **Inhalte der Altseite** – Crawl von https://fusspflege-wellness-leonberg.de war
   nicht möglich: die Egress-Allowlist dieser Umgebung blockiert alle Hosts außer
   Google Fonts. Texte stammen aus Suchmaschinen-Snippets und sind zu prüfen.
2. **Kontaktdaten** – Telefon, Straße und Öffnungszeiten sind in `index.html`
   als „ergänzen" markiert.
3. **Fotos** – aktuell CSS-Farbverlaufs-Platzhalter (`.ph-a` … `.ph-hero`).
   Für echte Bilder das `<div class="ph ph-x">` durch
   `<img src="assets/img/….jpg" alt="…">` ersetzen.
4. **Formular** – Terminanfrage braucht noch ein Backend bzw. einen Mailservice.
