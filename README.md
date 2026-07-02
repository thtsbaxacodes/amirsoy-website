# Amirsoy Mountain Resort

A multi-page website for Amirsoy, an all-season mountain resort in the Tian Shan
range near Tashkent, Uzbekistan. Built as a concept redesign / front-end practice
project.

The site covers the resort's main sections — accommodation, activities,
restaurants, business services — with individual detail pages for each of the six
chalet types and five restaurants. Content is available in English, Russian, and
Uzbek.

## Pages

- `index.html` — landing page (hero, about, activities, rooms, restaurants, reviews)
- `about.html` — about the resort
- `activities.html` — lifts, slopes, ticket prices, rope park, quad biking, spa
- `rooms.html` + six `chalet-*.html` detail pages
- `restaurants.html` + five `restaurant-*.html` detail pages
- `businesses.html`, `contact.html`, `safety-rules.html`, `offer.html`, `privacy-policy.html`

## Built with 

- HTML + Tailwind (via CDN)
- Vanilla JavaScript — no framework
- Custom CSS for animations, scroll reveals, and responsive tweaks (`style.css`)

# Amirsoy Mountain Resort — Static Website

Modern, multilingual static website for Amirsoy Mountain Resort (Amirsoy Hotel). The site showcases rooms, restaurants, services, offers, safety rules, and contact information in English, Russian, and Uzbek.

## Pages

- `index.html` — landing page (hero, about, activities, rooms, restaurants, reviews)
- `about.html` — about the resort
- `activities.html` — lifts, slopes, ticket prices, rope park, quad biking, spa
- `rooms.html` + six `chalet-*.html` detail pages
- `restaurants.html` + five `restaurant-*.html` detail pages
- `businesses.html`, `contact.html`, `safety-rules.html`, `offer.html`, `privacy-policy.html`

## Built with

- HTML + Tailwind (via CDN)
- Vanilla JavaScript — no framework
- Custom CSS for animations, scroll reveals, and responsive tweaks (`style.css`)

## Language switching

Translations live in `lang/en.js`, `lang/ru.js`, and `lang/uz.js`. The selected language is stored in `localStorage` and applied across every page through `lang-init.js`, so it persists as you navigate.

## Running locally

Open `index.html` in a browser or serve the folder locally:

```bash
# Python
python -m http.server 8000

# Node
npx serve
```

Then visit `http://localhost:8000`.

## Deployment

This is a static site and can be hosted on GitHub Pages or any static host. To publish from this repository:

```bash
gh pages publish --branch main --path .
```

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

## Notes

Images and brand assets belong to Amirsoy Resort and are referenced for demonstration purposes only.
