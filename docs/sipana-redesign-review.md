# SIPANA UI/UX Redesign Review

**Review date:** 8 November 2026  
**Native design file:** `docs/sipana-complete-ui.figcraft`  
**Review status:** Brand and system reconciliation completed; product decisions remain open

## Scope and method

Reviewed the PRD as the source of truth, `docs/design-brief.md`, `docs/design-direction.md`, and the design-system guidance in §12 of `docs/sipana_dokumen_desain_sistem.md`. Inspected the existing FigCraft document tree and rendered all 45 frames. Re-rendered the design-system board, public feeds at desktop, phone, and tablet sizes, and representative UMKM and admin dashboards after the edits.

No design-reference directory or image file was present in the workspace. The visual mapping therefore uses the product/design documents and official brand PNGs only. The approved green-forward **Jaringan Pangan Lokal** direction is now marked approved in `docs/design-direction.md`; the old blue palette and alternate font recipes in the source design-system chapter are explicitly marked historical and point to the current system documentation.

## Review scores

Scores are design-review judgments on a 1–5 scale, not results from user testing.

| Area | Score | Review |
|---|---:|---|
| Product identity and visual coherence | 4.4 | Forest and leaf greens, warm paper surfaces, restrained citrus, and calm editorial hierarchy fit a local food-sharing service and remain distinct from a commercial marketplace. |
| Information hierarchy | 4.2 | Availability, food, pickup timing, purpose, and verified giver are easy to scan in the public feed. UMKM and admin screens use task-oriented layouts. |
| Responsive public discovery | 4.2 | Feed layouts work across desktop, phone, and tablet; the phone feed now exposes purpose and has larger detail actions. |
| Design-system reuse | 4.1 | The document now has native variables and styles; principal buttons, badges, navigation, and listing-card masters use auto-layout. Existing screen instances are not yet comprehensively bound to the tokens. |
| Accessibility readiness | 3.8 | Checked core color pairings and feed action sizes. Static designs cannot establish keyboard behavior, accessible names, focus handling, or implementation semantics, and those need implementation-level verification. |

## Changes made in FigCraft

- Added a native `SIPANA Foundations` variable collection with 30 tokens: brand and semantic colors, spacing values, and component radii.
- Added six native styles: four text styles and two paint styles.
- Bound core fills and text colors on the reusable button, badge, field, listing-card, and navigation masters to the new variables. Added horizontal or vertical auto-layout to the buttons, badges, navigation item, and listing-card master.
- Changed the listing-card master and public desktop feed to content-first layouts. Removed food emoji and decorative photo slots from the desktop feed; the feed does not depend on food photography.
- Removed the unconfirmed search control and unsupported result counts from public desktop, phone, and tablet feed frames. Kept the district filter (P1) and purpose filter (P2), which are listed in the PRD.
- Added giver names and purpose labels to the desktop, phone, and tablet feed cards. Raised phone and tablet “Lihat detail” targets to 44 px; desktop actions remain 48 px.
- Marked sample values as preview data on UMKM and admin metric views. Corrected the example completion ratio from 87% to 88% (172 of 196, rounded to the nearest whole percent).
- Preserved existing role flows, navigation, states, and screen content outside these focused changes.

## Brand identity and system reconciliation

- Inspected every file in `apps/web/src/assets/`: `logo.png` (1600 × 1600, transparent icon mark) and `logotext.png` (1600 × 481, transparent horizontal lockup). No SVG or light/dark/inverse variant is present.
- Replaced 31 light-surface text placeholders with native FigCraft image layers using the official assets: the horizontal lockup in desktop/light contexts and the square mark in the two mobile navigation headers. Preserved the existing 45 frames and all non-logo components.
- Retained 11 white native text wordmarks on forest/dark surfaces where official navy artwork would not remain legible. This is a documented temporary fallback pending an approved inverse asset.
- Corrected the design-direction token mapping: `color/leaf` is `#1C6B4A`; `color/success` is `#236644`. Updated the product design brief's former “tokens absent” note and added authoritative brand and migration documents.
- The new [`brand-identity-guidelines.md`](brand-identity-guidelines.md) documents official asset paths, variants, aspect ratios, usage, clear-space recommendations, and the dark-surface exception. [`design-system-migration-status.md`](design-system-migration-status.md) inventories native tokens/styles/components and remaining adoption work.

## Visual QA findings

- Re-rendered the design-system board and public feed at 1320 px desktop, 390 px phone, and 768 px tablet frame sizes. The updated cards have no photo dependency, and giver, quantity, pickup, purpose, verification, and detail action remain visible.
- Re-rendered representative UMKM and admin views. Their data-preview notes are visible and the priority tablet feed collision found during the first pass is corrected.
- No clipping or text overlap was observed in the final targeted renders. This was a visual review, not an automated text-overflow audit of every layer.
- Selected contrast pairs were calculated from the token colors: forest on white 12.47:1; leaf on white 6.46:1; muted on canvas 4.54:1; warning on warning surface 4.66:1; purpose text on purpose surface 5.63:1. These pass WCAG 2.1 AA for normal text, with muted-on-canvas close to the 4.5:1 threshold.
- The public feed’s phone and tablet detail targets are 44 px high and the desktop target is 48 px. Other controls across all screens were not exhaustively measured.
- The current UI is mostly built from individually positioned screen layers. Reusable masters now use native auto-layout, but converting every existing screen to responsive auto-layout remains a future maintenance pass.

## Reference mapping

| Input | Design application |
|---|---|
| PRD | Public browsing without registration; verified UMKM identity; food type, portions, cooking time, purpose, and pickup window; report and handover trust cues; no payment or delivery. |
| Product design brief | Three role contexts; pilot districts; responsive and WCAG 2.1 AA targets; search/photo/filter scope cautions; unresolved legal, privacy, and data decisions. |
| `docs/design-direction.md` | Approved Jaringan Pangan Lokal: grounded local exchange, forest/leaf palette, citrus as a restrained highlight, clear handover facts, content-first cards, Inter styles. |
| `docs/sipana_dokumen_desain_sistem.md` §12 | Older blue and alternate font recipes are explicitly marked historical; its authority note points to the current logo/system docs and FigCraft file. |
| `apps/web/src/assets/` | Two official transparent PNG assets; mapped to their light and compact placements. No inverse variant exists. |
| `docs/design-references/` | No reference folder or image files were found in the workspace. |

## Decisions still needed

The visuals do not resolve product-policy gaps. Before implementation, product owners should decide:

1. The canonical purpose taxonomy. FR-021 and the data-model wording differ on redistribution and “keduanya”. The feed uses the shared plain label “Untuk konsumsi” pending a canonical set.
2. Claim quantity, active-claim quota, whether one claim consumes the entire listing, and how quota is restored.
3. Handover confirmation ownership and dispute/non-response behavior; cancellation and no-show cooldown rules.
4. Pickup-window storage and whether the exact pickup address/contact is public or claim-gated.
5. Whether listing photos are excluded, optional, or required; the public feed no longer implies a required photo.
6. Recipient terms timing, reporting targets/reason categories, and the canonical login identifier.
7. Safety/legal wording, including the PRD’s allergen goal versus the absence of an allergen field in FR-020.
8. Notification channels and preferences; notification settings remain marked as channel TBD.
9. Impact-measurement scope, weight conversion, and whether UMKM receives a personal impact report. The example UI avoids claiming kilograms.
10. Admin user-management and platform-metric requirements, plus privacy, audit, and identity-document retention rules.

## Saved deliverable

The existing native FigCraft file `docs/sipana-complete-ui.figcraft` was saved in place. It contains one page, 45 frames, six styles, 30 variables, and 31 placed brand image layers referencing the two official PNG assets. No other FigCraft document was modified. The native design was reviewed in FigCraft renders; no HTML, CSS, React, Figma MCP, or browser automation was used.
