# SIPANA Brand Identity Guidelines

**Status:** Current working guidance, aligned to the approved *Jaringan Pangan Lokal* direction  
**Reviewed:** 8 November 2026  
**Product authority:** [`PRD.md`](PRD.md)  
**Native visual reference:** [`sipana-complete-ui.figcraft`](sipana-complete-ui.figcraft)

## 1. Brand role

SIPANA connects verified culinary UMKM in Karawang with residents who can discover and claim surplus food for pickup. The visual identity should feel local, dependable, practical, and respectful. It should make the giver, food, declared purpose, quantity, and pickup window easy to understand. Verification is about the UMKM account; it must not imply that SIPANA inspected or guarantees the food.

The approved product direction is **Jaringan Pangan Lokal**. Its interface palette is green-forward with warm paper surfaces and restrained citrus. This is the product interface palette, not a recoloring or reconstruction of the logo. Keep official logo artwork unchanged and pair it with light neutral surfaces where its colors remain clear.

## 2. Official assets found

The complete `apps/web/src/assets/` inventory contains two brand assets:

| Asset | Source dimensions | Format and transparency | Role |
|---|---:|---|---|
| [`apps/web/src/assets/logotext.png`](../apps/web/src/assets/logotext.png) | 1600 × 481 px; ratio 3.326:1 | PNG, RGBA transparency | Primary horizontal lockup: icon, SIPANA wordmark, and tagline. Preferred for desktop navigation, landing, authentication, and UMKM light surfaces. |
| [`apps/web/src/assets/logo.png`](../apps/web/src/assets/logo.png) | 1600 × 1600 px; square | Indexed PNG with palette transparency | Icon-only mark. Preferred for compact mobile navigation. |

Both are transparent raster images. No SVG, vertical lockup, alternate horizontal lockup, light/inverse artwork, or separately named dark variant was found. The horizontal lockup artwork is navy with light-blue and orange elements. The artwork's color values are not interface tokens; no separate official brand color specification was present in the asset directory.

These files are the primary identity references. Do not redraw, approximate, trace, recolor, crop, or stretch them. No asset was replaced or generated during this audit.

## 3. Placement and sizing

- **Desktop public navigation, landing, authentication, and UMKM navigation:** use `logotext.png`. Preserve the source ratio. Existing FigCraft placements use widths of 150–200 px (45.1–60.1 px tall); the width may respond to available navigation space while keeping that ratio.
- **Mobile recipient and UMKM navigation:** use the square `logo.png` mark at 36 × 36 px in the current 390 px layouts. Preserve its square ratio and keep the product identity consistent with the desktop lockup.
- **Dark role sidebar and dark footer:** the official artwork has no inverse variant and its navy details lose definition against the forest surface. Keep the existing white native text wordmark as a documented temporary fallback. Do not place the navy artwork directly on the dark background or add a decorative plate just to force it to fit. Request an approved inverse asset if full artwork is required on dark surfaces.
- **Other contexts:** use the horizontal lockup on white or the warm canvas when it can be displayed at a legible size. Do not place the artwork over food photography or status colors.

The source assets do not state a formal minimum size or clear-space measurement. For the current digital placements, preserve an unobstructed margin of at least 8 px around the compact mark and 12 px around the horizontal lockup. These are layout recommendations for this system, not official logo specifications. Navigation spacing may serve as the clear space when no other element intrudes into the margin.

Never duplicate a visible native “SIPANA” wordmark behind or over the raster lockup. Keep `logotext.png` and `logo.png` in native FigCraft image layers so they remain replaceable assets and the rest of the design stays editable.

## 4. Color relationship

Use the native FigCraft **SIPANA Foundations** interface tokens as the green-forward product palette. Forest and leaf establish the interface; citrus is a restrained highlight; semantic warning, danger, success, and information colors retain their distinct meanings. White and canvas surfaces let the official navy/light-blue/orange logo remain legible without changing the artwork.

Do not turn colors sampled from a raster logo into new interface tokens. Do not use citrus as small text on white, warning color as general brand decoration, or green alone to communicate purpose, verification, or availability. The token list and contrast notes are in [`design-system-migration-status.md`](design-system-migration-status.md).

## 5. Accessibility and implementation

- Brand links must expose the accessible name **SIPANA**. If a visible adjacent label already names the same link, avoid a duplicated spoken name.
- Do not use the logo as a safety seal, food inspection mark, or proof that a listing is safe.
- Preserve visible focus around the interactive brand link without changing the image itself.
- The dark fallback is text, so its contrast must remain at least 4.5:1 against the forest rail/footer and be verified in the implemented interface.
- The PNG assets are raster at 1600 px source width. They are suitable for the current display sizes; retain the original source files and do not resave them through lossy formats.

## 6. FigCraft coverage reviewed

The saved native file now uses **31 image layers** referencing the two official PNGs. The horizontal lockup is used on the system board and light desktop/public, authentication, tablet, and UMKM placements. The compact icon is used in mobile recipient and mobile UMKM headers. Eleven existing white text wordmarks remain on dark role sidebars (including admin and notification preferences) and the dark landing footer; these are the only intentional exceptions pending an inverse asset. No screens or non-logo components were removed or redesigned for this pass.

