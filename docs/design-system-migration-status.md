# SIPANA Design-System Migration Status

**Reviewed:** 8 November 2026  
**Native file:** [`sipana-complete-ui.figcraft`](sipana-complete-ui.figcraft)  
**Direction:** Approved — *Jaringan Pangan Lokal*  
**PRD:** [`PRD.md`](PRD.md) remains the primary source for product functionality and scope.

## 1. Current authority

Use the PRD for behavior and feature scope, the approved [`design-direction.md`](design-direction.md) for visual intent, this document for the audited native token/component state, and [`brand-identity-guidelines.md`](brand-identity-guidelines.md) for official logo use. The blue, navy, and font recipes retained in §12 of [`sipana_dokumen_desain_sistem.md`](sipana_dokumen_desain_sistem.md) are historical examples, not active visual specifications. The native FigCraft file is the visual source for the current implementation.

## 2. Native foundation inventory

The file has one page, **45 frames**, **31 placed brand image layers**, **30 variables** in the `SIPANA Foundations` collection, and **6 styles**. The existing document structure and non-logo component masters were preserved.

### Color variables

| Variable | Value | Intended use |
|---|---|---|
| `color/forest` | `#183A2E` | Main headings and deep brand ink |
| `color/leaf` | `#1C6B4A` | Primary actions and active brand accents |
| `color/citrus` | `#D8F279` | Limited highlight/selected surface; pair with dark ink |
| `color/canvas` | `#F5F7F1` | Warm page canvas |
| `color/paper` | `#FFFFFF` | Navigation, forms, and content surfaces |
| `color/ink-subtle` | `#52645A` | Secondary/de-emphasized ink |
| `color/muted` | `#63756B` | Supporting text |
| `color/border` | `#DDE5DC` | Borders and dividers |
| `color/success` | `#236644` | Success and verified text |
| `color/warning` | `#A65B15` | Warning text and time attention |
| `color/danger` | `#A33B32` | Error, report, or destructive state |
| `color/info` | `#245A8D` | Informational state |
| `color/verified-bg` | `#E6F3E9` | Verified badge background |
| `color/purpose-bg` | `#F1F2E7` | Purpose badge background |
| `color/warning-bg` | `#FFF4DE` | Warning/pending background |
| `color/danger-bg` | `#FDE9E7` | Error/destructive background |
| `color/food-surface` | `#D5E6D6` | Neutral food-content placeholder surface; does not require a photo |
| `color/text-primary` | `#183A2E` | Primary text |
| `color/text-secondary` | `#52645A` | Secondary text |
| `color/placeholder` | `#8A978F` | Placeholder text; not for essential instructions |

### Spacing and geometry variables

| Variable family | Values |
|---|---|
| `space/1` through `space/7` | 4, 8, 12, 16, 24, 32, 48 px |
| `radius/control` | 8 px |
| `radius/surface` | 12 px |
| `radius/feature` | 16 px |

There is no native breakpoint or column-grid variable family. Reviewed frames cover 390 px mobile, 768 px tablet, and 1320 px desktop content. The design brief's 360–1920 px support target remains the implementation QA range; exact reflow breakpoints should follow content fit and are not settled by this file.

### Typography styles

| Native style | Specification |
|---|---|
| `Type/Display` | Inter, 30 px, Bold, automatic line height |
| `Type/Body` | Inter, 16 px, Regular, automatic line height |
| `Type/Caption` | Inter, 14 px, Medium, automatic line height |
| `Type/Section label` | Inter, 13 px, Bold, automatic line height |
| `Color/Forest` | Paint style, `#183A2E` |
| `Color/Leaf` | Paint style, `#1C6B4A` |

The board also describes roles H1 36, H2 28, H3 22, body 16, and caption 13. These extra sizes are not separate native text styles yet. Keep mobile body copy at 16 px or larger; use smaller sizes only for concise supporting metadata after contrast and readability review.

## 3. Component masters and current bindings

| Component master | Native geometry | Auto-layout | Variable connections observed |
|---|---|---|---|
| `Button / Primary` | 240 × 58 px; radius 14 px | Horizontal; 16 px side padding | Leaf fill; paper text |
| `Button / Secondary` | 210 × 58 px; radius 14 px | Horizontal; 16 px side padding | Paper fill; leaf text |
| `Badge / Verified` | 172 × 42 px; radius 21 px | Horizontal; 10 px side padding | Verified background; success text |
| `Badge / Purpose` | 168 × 42 px; radius 21 px | Horizontal; 10 px side padding | Purpose background; leaf text |
| `Field / Text input` | 410 × 100 px; radius 14 px | Not auto-layout | Paper fill; field label and placeholder colors |
| `Card / Listing` | 430 × 170 px; radius 20 px | Vertical; 16 px padding; 10 px gap | Paper fill; title and metadata colors. Purpose text is not bound. |
| `Status / Pending` | 230 × 54 px; radius 16 px | Not auto-layout | Warning background and warning text |
| `Navigation / Tab item` | 230 × 64 px; radius 16 px | Horizontal; 10 px side padding | Paper fill and leaf text |

These are master-frame sizes in the design-system board, not a mandate that all instances use a fixed width. Auto-layout is present on both buttons, both badges, the listing-card master, and the navigation tab item. The field and pending-status masters remain manually structured. Core component colors are connected to native variables, but the 45 screens are not comprehensively bound to tokens. Many screen layers still use individually positioned geometry and direct color values. Treat this as a reusable foundation, not a completed responsive migration.

The style inventory contains four text styles and two paint styles. It does not contain an elevation/shadow token or effect style; the current visual language uses surface contrast and fine borders as primary grouping. Do not add shadows by default.

## 4. Layout and responsive principles

- The approved visual thesis is local exchange with clear handover facts, calm hierarchy, and moderate density. Keep public listing food, giver, quantity, pickup, purpose, and verification facts close together.
- Use the spacing scale by relationship: 8 px for close label/control groups, 16 px for related rows, 24 px for panel insets, and 32 px between distinct sections; use 4/12/48 px where their relative roles call for them.
- Desktop feed uses a three-column listing arrangement at the 1320 px frame; mobile feed uses a single-column sequence with an accessible bottom navigation; tablet is separately composed at 768 px.
- Reflow information for narrow viewports rather than shrinking the desktop composition. Preserve the detail action and the key listing facts. Maintain 44 × 44 px minimum touch targets and 16 px minimum mobile body copy.
- No listing photo is required by the native feed. The neutral food surface is not evidence of an approved photo requirement.
- Avoid unconfirmed controls, fabricated metrics, or claims beyond the PRD. Keep status meaning in text as well as color.

## 5. Accessibility checks and limits

Selected native token pairs were checked during visual review: forest on white 12.47:1; leaf on white 6.46:1; muted on canvas 4.54:1; warning on warning background 4.66:1; and purpose text on purpose background 5.63:1. These are selected-pair checks, not a complete contrast audit of all screen layers or states. Recheck all foreground/background combinations after implementation.

The native frames support visual review only. Keyboard order, accessible names, semantic HTML, screen-reader announcements, focus appearance, and reduced-motion behavior need implementation-level checks. The design brief specifies WCAG 2.1 AA, keyboard access, visible focus, programmatic error associations, and TalkBack/NVDA review.

## 6. Brand migration result

The audit found two official transparent PNG assets and no inverse logo. The native FigCraft document now has 31 image layers using those assets: the horizontal lockup in light system, public, tablet, authentication, and UMKM contexts; the compact icon in mobile recipient and mobile UMKM headers. Eleven white native text wordmarks remain on dark role sidebars (including admin and notification preferences) and the dark public footer because neither asset is suitable on those forest backgrounds. See the [`brand guidelines`](brand-identity-guidelines.md) for ratios, placement, and the temporary exception.

The saved document was rendered after these changes. Inspected renders covered the system board, public feed, landing, mobile recipient feed, mobile UMKM dashboard, recipient registration, UMKM dashboard, admin verification queue, and notification preferences. The render check found no logo overlap, distortion, or frame loss in these views. This does not constitute a text-overflow or interaction audit of all 45 screens.

## 7. Remaining migration work

1. Request or approve an inverse SIPANA logo for dark admin rails/footer, or confirm that the white text-only fallback is the lasting brand treatment in those contexts.
2. Bind screen-level colors, text styles, and spacing to the native variables/styles; keep exceptions documented when intentional.
3. Add named heading/body styles for the remaining approved type roles and decide line-height values from implementation rendering.
4. Define content-fit responsive breakpoints and a grid/container system, then validate from 360 to 1920 px.
5. Convert additional repeated screen structures to auto-layout incrementally without disturbing approved screen behavior.
6. Verify all component/control dimensions, focus states, contrast pairs, screen-reader names, keyboard flows, and reduced motion in the implemented UI.
7. Replace the historical visual recipes in §12 of `sipana_dokumen_desain_sistem.md` during a future editorial pass; the authority note added there directs readers to this system meanwhile.

## 8. Product decisions still unresolved

The PRD remains authoritative. Visual work does not decide the following product questions:

- Canonical purpose taxonomy and user-facing terms.
- Claim quantity, active-claim quota, and whether one claim reserves a whole listing or portions remain.
- Handover confirmation ownership, disputes, and non-response.
- Cancellation, no-show, and quota-restoration rules.
- Pickup-window storage and public versus claim-gated address/contact disclosure.
- Whether listing photos are excluded, optional, or required for the pilot.
- Recipient terms timing, reporting scope/reasons, and canonical login identifier.
- Food-safety/legal wording and the PRD allergen goal versus the missing required allergen field.
- Notification channels and preferences.
- UMKM impact metrics and weight conversion; no unsupported kilogram claim should be shown.
- Admin user-management scope, platform metrics, privacy retention, and audit rules.

