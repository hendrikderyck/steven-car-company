# Steven Car Company – Website

Website voor Steven Car Company BV (Ninove): aan- en verkoop van jonge occasions. Zwart/wit, persoonlijk, vertrouwen.

**Domein:** stevencarcompany.be  
**Deadline:** 27/02/2026

## Technologie

- **Astro** (static site, file-based routing)
- **React** (islands voor Home-animaties en Aanbod-filters)
- **Tailwind CSS v4** voor styling
- **Framer Motion** voor animaties

## Sitemap

- **Home** – Intro, sfeer, CTA naar aanbod, 5★ Autoscout24 reviews, Bel nu CTA
- **Aanbod** – Overzicht wagens (nu mockdata, later AutoScout24 API)
- **Diensten** – Aan- en verkoop, overname mogelijk
- **Over Ons** – Verhaal van Steven, gezicht achter de zaak
- **Contact** – Telefoon centraal, adres, Facebook

## Ontwerp

- Stijl: jong, dynamisch, persoonlijk. Zwart/wit/strak, geen felle kleuren.
- Geen “Boek een testrit” – klant doet geen testritten. CTA: **Bel nu** (0487 45 03 31).
- Autoscout24 reviews (5 sterren, 46+ reviews) in de Hero.
- Overname mogelijk vermeld op meerdere plekken.

## Autoscout24 (later)

De voorraad staat nu als **mockdata** in `src/data/cars.ts`. Later:

1. Autoscout24 feed/API koppelen.
2. Wagens op de site tonen als native onderdeel (geen doorverwijzing naar Autoscout).
3. Reviews uit Autoscout kunnen eventueel dynamisch worden opgehaald.

## Lokaal draaien

```bash
cd steven-car
npm install
npm run dev
```

Open http://localhost:4321 (Astro dev server)

## Build voor productie

```bash
npm run build
```

Output in `dist/`. Deze map kan op de server (Combell of andere host) worden geplaatst. DNS voor stevencarcompany.be moet t.z.t. naar de nieuwe server wijzen.

## Logo

De klant levert een logo met zwarte achtergrond. Momenteel staat een placeholder (SCC) in de header en footer. Vervang deze door het echte logo-bestand in `public/` en pas de Layout-component aan.

## Foto’s

Huidige car-afbeeldingen zijn placeholders (Unsplash). Later: echte stockfoto’s (bij het huis) of professionele foto’s. Het systeem is eenvoudig aan te passen via de data/API.
