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

## Bilder

Originale liegen in `public/images/`, die ausgelieferten Varianten als WebP in
`assets/img/` (12 MB PNG → 342 KB WebP). Neu erzeugen mit dem Skript-Aufruf aus
der Historie oder per `sharp`-Einzeiler.

| Verwendung | Datei |
|---|---|
| Hero | `Fusspflege Sandra Leonberg.png` |
| Hero-Kacheln 1–4 | `01_gepflegte_fuesse` … `04_wellness_handtuecher` |
| Studio-Kacheln (Über uns) | `studio1`, `studio2`, `studio3` |
| Leistung Wellness-Fußpflege | `wellness-fusspflege.png` |
| Leistung Sportlerfüße | `sportlerfusse.png` |
| Leistung Diabetisch | **fehlt** – aktuell `studio2` als Platzhalter |
| Leistung Eingewachsene Nägel | **fehlt** – aktuell `03_spa_travertin` als Platzhalter |

## Offene Punkte
1. **Inhalte der Altseite** – Crawl von https://fusspflege-wellness-leonberg.de war
   nicht möglich: die Egress-Allowlist dieser Umgebung blockiert alle Hosts außer
   Google Fonts. Texte stammen aus Suchmaschinen-Snippets und sind zu prüfen.
2. **Kontaktdaten** – Telefon, Straße und Öffnungszeiten sind in `index.html`
   als „ergänzen" markiert.
3. **Fotos** – es fehlen noch `diabetische fusspflege.png` und
   `eingewachsene.png`; die beiden Leistungskacheln zeigen bis dahin
   Platzhalter (im Markup als Kommentar markiert).
4. **Formular** – Terminanfrage braucht noch ein Backend bzw. einen Mailservice.
