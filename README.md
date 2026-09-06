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
| Hero-Kacheln 1–4 | dieselben Motive wie die vier Leistungen |
| Studio-Kacheln (Über uns) | `studio1`, `studio2`, `studio3` |
| Leistung Wellness-Fußpflege | `wellness-fusspflege.png` |
| Leistung Sportlerfüße | `sportlerfusse.png` |
| Leistung Wellness-Pediküre | `01_gepflegte_fuesse` |
| Leistung Diabetisch | **fehlt** – aktuell `studio1` als Platzhalter |
| Leistung Eingewachsene Nägel | **fehlt** – aktuell `studio3` als Platzhalter |
| Hausbesuch mobile Praxis | **fehlt** – aktuell `04_wellness_handtuecher` als Platzhalter |
| Ablauf, Pflegeprodukte | `02_wellness_serum`, `03_spa_travertin`, `04_wellness_handtuecher`, `studio2` |

## Offene Punkte
1. **Inhalte der Altseite** – Crawl von https://fusspflege-wellness-leonberg.de war
   nicht möglich: die Egress-Allowlist dieser Umgebung blockiert alle Hosts außer
   Google Fonts. Texte stammen aus Suchmaschinen-Snippets und sind zu prüfen.
2. **Kontaktdaten** – Telefon, Straße und Öffnungszeiten sind in `index.html`
   als „ergänzen" markiert.
3. **Fotos** – es fehlen `diabetische fusspflege.png`, `eingewachsene.png` und
   das Foto der mobilen Praxis (Trolley). Die betroffenen Stellen zeigen bis
   dahin Platzhalter, im Markup jeweils als Kommentar markiert.
5. **Inhalte aus der Altseite** – eingearbeitet sind der Leistungskatalog
   („Das gehört zur Behandlung"), die drei Spezialisierungen, die
   Wellness-Pediküre nach brasilianischer Art mit Naturlack und der Hausbesuch
   mit mobiler Praxis. Noch offen: Preise, Öffnungszeiten, Adresse, Telefon.
4. **Formular** – Terminanfrage braucht noch ein Backend bzw. einen Mailservice.
