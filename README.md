# Grading Lab Agency — website

Static marketing site for GLA (Baku). No build step, no dependencies — plain HTML, CSS and
vanilla JS. Open `index.html` or serve the folder and it runs.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — animated hero slab, counters, pillars, categories, process summary, inline certificate lookup |
| `services.html` | All eight grading/authentication categories with inspection criteria |
| `process.html` | Interactive grading desk, seven-stage process, the GLA 10-point scale, service levels, FAQ |
| `verify.html` | Certificate lookup, how to read a holder label, counterfeit guidance |
| `authenticity.html` | Certificates of Authenticity + witnessed signature authentication |
| `about.html` | Story, mission, vision, seven core values |
| `contact.html` | Submission enquiry form, contact details, packing checklist, FAQ |

## Assets

```
assets/css/style.css    all styling (design tokens at the top)
assets/js/main.js       mobile nav, sticky header, scroll reveal, footer year
assets/js/verify.js     certificate lookup + demo registry
assets/js/contact.js    form validation + submission
assets/js/gradingroom.js  interactive grading desk (tool copy lives here)
assets/js/counters.js   hero count-up animation
assets/img/             favicon and logo mark (SVG)
```

Fonts are loaded from Google Fonts: Outfit (headings), Inter (body), JetBrains Mono
(certification numbers).

## Two things to wire up before launch

### 1. The certificate database

`assets/js/verify.js` currently looks up a **bundled sample registry** of seven records so the
flow is usable today. Replace the `lookup()` function with a real call:

```js
function lookup(cert) {
  return fetch('/api/certificates/' + cert)
    .then(function (res) { return res.ok ? res.json() : null; });
}
```

The record shape the renderer expects:

```js
{
  title: 'Charizard — Holo',
  set: '1999 Pokémon Base Set, 1st Edition',
  category: 'Trading Cards',
  grade: '10',
  gradeLabel: 'Gem Mint',
  certified: '2026-02-14',          // ISO date
  holder: 'GLA Premium Slab',
  authOnly: false,                  // true for authentication-only items (no numeric grade)
  subgrades: { Centering: '10', Corners: '10', Edges: '10', Surface: '9.5' }
}
```

Then remove the two visible "Note for launch" paragraphs — one at the bottom of the lookup panel
in `verify.html`, one under the form in `contact.html`.

Certificate numbers are validated as `GLA` + 7 digits. Bare digits (`0001005`) are auto-prefixed,
and spaces/dashes are stripped.

**QR codes:** point them at `https://your-domain/verify.html?cert=GLA0001005` — the page reads the
`cert` query parameter and loads the record automatically, no typing required.

### 2. The contact form

`contact.html` has no backend. Add an endpoint to the form tag and it POSTs JSON:

```html
<form id="contact-form" data-endpoint="https://formspree.io/f/XXXXXXX" ...>
```

Without an endpoint it falls back to opening the visitor's mail client with the message
pre-filled, so nothing is lost. Change the fallback address via `data-fallback-email`.

## Placeholder content to replace

- **The four hero counter figures** — see the hero section above. These are invented.
- `info@gradinglab.agency` — used across all footers and the contact page. Swap for the real inbox.
- Pricing is deliberately not stated anywhere (quote on request). Add a pricing page or table
  when the rates are final.
- The turnaround times in `process.html` describe service *levels* without day counts — fill those
  in once they are fixed.

## Local preview

```bash
python3 -m http.server 4890 --directory gla-website
```

## Deploying

Any static host works — Netlify, Vercel, Cloudflare Pages, GitHub Pages. Drag the folder in, or
point the host at this directory as the publish root. No build command.

## The hero

A single 3D slab replaces the old row of flat cards. Everything is CSS and inline SVG — no
images, no libraries.

- **Rotation** — `.slab3d` spins a full 360° on `rotateY` over 26s inside a `perspective` stage.
  Two thin `.slab3d__edge` panels give it real thickness so it doesn't vanish at 90°. Hovering or
  tabbing into the stage pauses the spin so people can read either face.
- **Holographic label** — `.holo` is a multi-stop rainbow gradient at 320% width scrolling under
  `mix-blend-mode: screen`, with a specular bar sweeping across it on a second timer. The dotted
  band beneath it (`.slab3d__micro`) stands in for security microprint.
- **Inspection loupe** — the lens glides between three points over the card while a 2.4× copy of
  the same artwork shifts underneath it, so it magnifies genuinely rather than faking a blur. The
  card is drawn once in a hidden `<defs>` as `#glaCardArt` and pulled in twice with `<use>`, so
  the lens can never drift out of sync with what it is magnifying.
  **If you move the lens path, both `@keyframes loupePath` and `@keyframes loupeZoom` must
  change together** — for a lens centre at (x, y): path is `translate(x-50, y-50)` and zoom is
  `translate(50 - 2.4x, 50 - 2.4y) scale(2.4)`.
- **Back face** — the certification record: sub-grades, a QR block and the verify prompt. The QR
  graphic is decorative line art, not a scannable code; swap in a real one if you ever print from it.
- **Reduced motion** — everything stops and the slab holds a static three-quarter pose with the
  lens parked over the card. The base transforms next to each animation are what it falls back to.

### The counters — placeholder numbers

**The four figures in the hero are invented placeholders. Replace them before publishing.**

Each `.counter__value` carries the real number twice: as `data-count` (what the animation counts
up to) and as its visible text (what shows without JavaScript). Change both:

```html
<span class="counter__value" data-count="1000" data-suffix="+">1,000+</span>
```

Currently shipping: 1,000+ items graded, 250+ population records, 10 highest grade awarded,
14 countries served. Only the highest grade (10, Gem Mint) is a real, safe value — it is the top
of the GLA scale. The other three are guesses and should not go live as they are.

## The interactive grading desk

`process.html` opens with a hand-drawn SVG desk holding five instruments — gloves, magnifier,
microscope, UV lamp, calipers. Clicking a tool (or its chip) swaps the explanation panel beside it
and lights that tool up; selecting the UV lamp also brightens its beam across the desk.

- All copy lives in the `TOOLS` object at the top of `assets/js/gradingroom.js` — edit the text
  there, no markup changes needed. Tool 1's content is also hard-coded in `process.html` so the
  panel is populated before JavaScript runs.
- The SVG is `role="img"` with a description, so screen readers get the scene as one image; the
  chip row underneath is the real accessible control (proper buttons, `aria-pressed`, 44px tall).
- Each tool has an invisible `.tool__hit` rectangle sized so the tap target stays ≥44px even on a
  375px screen. If you move artwork, move its hit rect too and keep the rects from overlapping.
- To add a sixth tool: draw a `<g class="tool" data-tool="yourid">` with a badge and hit rect, add a
  matching chip button, and add an entry to `TOOLS`.

## Colour system

Violet is the brand, but the site is not monochrome. Eight desaturated accents sit alongside it,
declared as `--a-*` tokens in `:root`. Colour is only ever applied to small surfaces — icons,
1px hairlines, chips, borders, numerals — never to large fills. That is what keeps a dark page
rich instead of glowing.

Accents are opt-in through `data-accent` on any element:

```html
<div class="card" data-accent="gold"> … </div>
```

That sets `--accent`, `--accent-soft`, `--accent-line` and `--accent-sheen` for everything
inside, so the card's icon, eyebrow, check-list ticks, hover border, top hairline and foil sheen
all recolour together. Valid values: `violet` `gold` `cyan` `rose` `amber` `sky` `emerald`
`indigo`.

Every accent means something rather than decorating at random:

| Where | Logic |
| --- | --- |
| Service categories | One fixed hue per category — trading cards violet, sports sky, comics rose, video games cyan, diecast amber, coins gold, banknotes emerald, autographs indigo. Used on the cards, the jump tags and the service blocks, so a category looks the same everywhere. |
| Grading scale | `data-tier` on `.grade-chip` colours by quality: gem gold, mint violet, near-mint teal, mid blue, low grey. The table reads as a gradient of condition. |
| Process & timeline | `nth-child` walks the palette in order, so the seven stages read as a journey rather than seven identical bullets. |
| Hero counters | One accent each, so the row is not four identical numbers. |
| Page heads | Each page opens on its own hue via `data-accent` on `.page-head`. |

Texture, all CSS, no image files: a lab-bench grid faded out by a radial mask (`body::after`),
a fine grain layer that stops the large gradients from banding (`.grain`, one div per page),
gold/teal/rose blooms in the ambient haze, corner registration marks on the panel surfaces, an
iridescent hairline above the footer, and a foil sheen that sweeps accented cards on hover.

Measured contrast after the recolour: worst accent is **8.35:1** against the page background,
and every grade chip is 10:1 or better — comfortably past AAA, which is why none of it halates
on a dark screen.

## Design notes

- Colour, spacing, radius, shadow and motion tokens all live in `:root` at the top of
  `style.css`. Change the brand there and it propagates everywhere.
- Dark-only by design, matching the brand. Body text is 4.5:1+ against the background.
- Respects `prefers-reduced-motion` (reveal animations and transitions are disabled).
- Fully keyboard navigable: skip link, visible focus rings, `aria-expanded` on the mobile menu,
  `aria-live` on lookup results and form status.
- No horizontal scroll at 375px; the grading-scale table scrolls inside its own container.
- `@media print` is set up so a verified certificate prints cleanly on white.
