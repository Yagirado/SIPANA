# SIPANA Visual Direction

**Status:** Approved — Jaringan Pangan Lokal  
**Scope:** Product-wide visual identity and UX direction for the responsive web pilot  
**Primary authority:** [PRD](PRD.md). This direction does not resolve product or policy gaps identified in the [design brief](design-brief.md).

## Product understanding

SIPANA connects verified culinary UMKM in Karawang with community members who can claim available surplus food and pick it up during a stated window. The pilot focuses on Karawang Barat, Telukjambe Timur, and Karawang Timur. Its core loop is: a UMKM posts a small quantity of food with preparation time, purpose, pickup details, and a safety attestation; a community member discovers and claims it; the UMKM records the handover; users can report concerns; administrators verify businesses and moderate reports.

The visual system needs to serve three different working contexts through one recognizable product: public and recipient discovery, quick UMKM operations, and an administrative verification/moderation queue. The most important product outcomes are verified supply, successful claims and handovers, complete and legible safety context, fast repeat posting, and a measurable record of distributed portions. The pilot is free; payment, delivery, a native mobile app, and areas outside the pilot are out of scope.

### Users and design implications

| User | Main job and constraint | Design response |
|---|---|---|
| **UMKM owner/operator (P1)** | Post a small daily surplus quickly from a phone; low-to-moderate digital confidence; liability and reputation concerns. | Make “Posting Cepat” easy to reach, minimize repeated typing, use plain Indonesian, keep verification and attestation factual and explicit, and give clear status and recovery feedback. |
| **Community member / recipient (P2)** | Find food available now, understand pickup and purpose, claim without confusion, and trust the giver. Often mobile-first and time-constrained. | Lead with availability, portions, pickup window, district, purpose, verified giver, and the claim action. Keep browse open to visitors; require an account only at the claim boundary. |
| **Community redistributor (P3)** | Claim for others where permitted and pass food on according to its declared purpose. | Make purpose and quantity unambiguous. Do not imply organization accounts, multi-recipient claims, or proof-of-redistribution workflows that are not specified. |
| **SIPANA admin (P4)** | Review UMKM submissions and reports, preserve an audit trail, and prepare impact recaps. | Favor calm, scannable queues, clear decision context, explicit reasons, and audit details over decorative dashboard metrics. |

### Journey hierarchy

1. **Discover:** browse available listings without registering; use only confirmed discovery controls, led by district filtering.
2. **Evaluate:** inspect food type, portions, cooking/preparation time, stated purpose, pickup window, UMKM identity and verification, safety attestation, and report access.
3. **Claim:** register or sign in at the claim boundary, then see the claim result and pickup facts. Quota, cancellation, and recipient terms remain subject to the unresolved rules below.
4. **Hand over:** the UMKM records the pickup; the recipient sees the resulting state. The exact confirmation model needs a product decision.
5. **Operate:** UMKM returns to quick posting, listing management, and incoming claims; admins work verification and report queues and use the defined impact/export functions.

## Three visual directions

These concepts differ in their organizing idea and task hierarchy, not only their color or styling.

### A. Jaringan Pangan Lokal — the local handover ledger

**Concept:** Let each real food listing and its local handover facts form the recognizable visual language of SIPANA. The product reads as a clear neighborhood exchange record: what is available, from which verified UMKM, for what purpose, and by when it can be picked up.

- **Personality:** Dependable, grounded, civic, and welcoming; practical enough for daily UMKM operations.
- **Color philosophy:** Existing green-forward SIPANA colors signal food and participation. Warm paper and dark forest ink keep the interface human and legible. Citrus is a limited highlight for attention, never a status substitute.
- **Typography:** One highly legible sans family for the product; firm headings, open counters, readable body text, and tabular numerals for portions and times. Use typography for hierarchy rather than decorative labels.
- **Layout:** Public feed organizes around available listings and district; detail pages put safety and pickup context close to claiming. UMKM screens prioritize next action and work queue. Admin screens prioritize decision queues and records.
- **Component geometry:** Compact, consistent controls; modest corner radius; listing image or food name anchors a flat row/card. Use spacing and dividers before adding containers. Cards are reserved for distinct listings, selected items, or actionable records.
- **Image and illustration:** Realistic, locally plausible food photography where available, with honest lighting and varied foods from bakeries, warung, catering, and home kitchens. Avoid implying inspection or guaranteed safety. Use simple line illustrations only for meaningful empty or explanatory states.
- **Information density:** Moderate in recipient discovery; efficient and slightly denser for UMKM and admin work, with key facts grouped and scan-ready.
- **Iconography:** One consistent line-icon family. Pair icons with text for safety, purpose, destructive, and time-sensitive meaning.
- **Fit and trade-off:** Best supports the actual object that makes SIPANA distinctive—the traceable surplus listing and its handover—while staying familiar for mobile workflows. It requires disciplined listing content and truthful data; imagery cannot compensate for missing facts.

### B. Menjelang Batas Ambil — the daily food window

**Concept:** Organize discovery around the short, real pickup window: what can still be collected, where, and before what time. The interface expresses the daily rhythm of surplus without turning it into a countdown game.

- **Personality:** Immediate, practical, energetic, and respectful of people’s time.
- **Color philosophy:** Keep forest green as the stable brand; use a restrained warm amber for genuinely approaching pickup deadlines and neutral tones elsewhere. Color urgency must always accompany a readable time and status label.
- **Typography:** Strong time and quantity hierarchy with tabular numerals; restrained display scale; body and form copy remain plain Indonesian.
- **Layout:** Feed is ordered and grouped around available-now listings and pickup windows. A listing detail emphasizes pickup facts before secondary description. UMKM dashboard orders incoming work by next required action.
- **Component geometry:** Time and availability are compact metadata groups attached to the listing, not detached floating countdown cards. Deadline controls and status labels remain standard, predictable components.
- **Image and illustration:** Food photography shows the item, while a modest timeline or time-range treatment communicates the pickup interval. No animated ticking or urgency decoration.
- **Information density:** High enough to compare several listings and their pickup windows; detail view restores breathing room around the claim decision.
- **Iconography:** Clock and location symbols may aid scanning but never replace the actual time, district, or address policy.
- **Fit and trade-off:** Helps shift workers and UMKM coordinate around short windows. It risks overemphasizing urgency and underplaying purpose, verification, and safety context; those facts must remain equally visible.

### C. Jejak Terpercaya — the accountable food record

**Concept:** Treat safety context and accountability as the primary interface structure: a listing reads as a concise record of origin, declared purpose, preparation time, giver attestation, claim, and handover state.

- **Personality:** Reassuring, precise, transparent, and impartial.
- **Color philosophy:** Deep green and dark neutral ink establish stability; blue is reserved for informational states, amber for attention, and red for reports or destructive states. Distinct colors always pair with labels and icons.
- **Typography:** Highly legible sans serif, clear labels, consistent metadata alignment, and tabular time/quantity. Avoid technical or legal language except in the terms themselves.
- **Layout:** Detail pages use a structured fact sheet with origin and food context first, then pickup and claim. Verification and moderation interfaces favor timelines and audit records where the underlying data supports them.
- **Component geometry:** Mostly flat surfaces and fine dividers; badges are limited to true statuses such as verified, pending, or purpose. No shield motif should imply SIPANA inspected or certified the food.
- **Image and illustration:** Evidence-led listing photography where supported; simple document/record illustrations for empty states. Do not use inspection seals, laboratory imagery, or fabricated safety certifications.
- **Information density:** Moderate-to-high on detail and admin surfaces; lower on the public landing page. Labels and grouping prevent the information from reading as legal paperwork.
- **Iconography:** Shield/check icon only for verified UMKM, with an explicit “UMKM terverifikasi” label; use accessible, familiar icons for report and handover.
- **Fit and trade-off:** Directly addresses the strongest trust barrier and audit needs. It can make a simple, free pickup feel bureaucratic, so it should not govern the whole product or overwhelm the quick-post flow.

## Recommended direction

### Jaringan Pangan Lokal

Make the food listing and its local handover facts the product’s signature, with trust context embedded in the listing rather than separated into a generic “trust” dashboard. This direction connects SIPANA to its real work—small quantities of food moving between verified Karawang UMKM and nearby residents—and lets the marketing surface feel warm without forcing expressive styling into frequent operational screens.

**Design contract**

- **First-glance hierarchy:** Public feed: available food, portions, pickup window, purpose, district, verified giver. Listing detail: food and giver, preparation and pickup facts, purpose/attestation, then claim. UMKM home: “Posting Cepat” and incoming handovers. Admin: pending verification and report work.
- **Signature expression:** A listing’s small “handover record” groups origin, purpose, portions, preparation time, pickup window, and later claim/handover state. It improves confidence and continuity using real product data. Do not add tracking maps or invented impact figures to make it feel distinctive.
- **Shared system, role-specific shells:** Keep one palette, type system, controls, status vocabulary, and listing language. Use desktop top navigation for public/recipient, desktop sidebar for UMKM, and an admin work area. On mobile, recipient and UMKM use their specified bottom navigation; preserve task order and primary actions.
- **Surfaces:** Page background is warm neutral; white surfaces distinguish a listing or a task area; borders and whitespace establish most grouping. Elevation is reserved for overlays or truly layered content. Radius varies by role and remains modest.
- **Copy:** Bahasa Indonesia throughout; plain, respectful, specific. Example listing content: “Roti sobek cokelat · 4 porsi”, “Bisa diambil 16.30–18.00 WIB”, “Karawang Barat”, “Peruntukan: konsumsi manusia”. Use “Pernyataan keamanan dari UMKM” rather than copy implying SIPANA guarantees food safety. Local vocabulary such as “Akang/Teteh” may be used sparingly if research validates it; do not force it into every label.
- **Motion:** Minimal. Use brief feedback only for submission, claim, or status changes; announce meaningful state changes to assistive technology and respect reduced motion. No decorative scrolling or ticking countdown.

**Trade-off:** The direction is less campaign-like than a highly expressive food-rescue brand. Its distinctive quality comes from real listing content, local context, and clear handover facts; that keeps the core workflow efficient and trustworthy.

## Preliminary design foundations

The proposed palette reconciles the PRD’s green-forward requirement with colors in the existing `sipana-complete-ui.figcraft` reference, inspected locally without using FigCraft MCP. Contrast values below are calculated against white for text colors; they are preliminary token checks, not a complete WCAG audit. Validate every final foreground/background pair in implementation, including focus, disabled, hover, and state variants.

| Role | Color | Use and contrast note |
|---|---|---|
| Forest ink | `#183A2E` | Primary text and strong headings; 12.47:1 on white. |
| Leaf | `#1C6B4A` | Primary action and brand anchor with white label; 6.46:1 on white. |
| Success | `#236644` | Positive/verified status with explicit text; 6.87:1 on white. |
| Citrus | `#D8F279` | Limited highlight or selected surface with forest ink; 10.04:1 for forest ink on citrus. Never use white text on it. |
| Canvas | `#F5F7F1` | Warm page canvas; use forest ink or checked text colors. |
| Paper | `#FFFFFF` | Listing, form, and work surfaces. |
| Muted green-gray | `#63756B` | Secondary text; 4.90:1 on white. Recheck against paper and disabled surfaces. |
| Pickup attention | `#A65B15` | Amber text/icon for an approaching deadline; 5.09:1 on white. Pair with explicit time and wording. |
| Information | `#245A8D` | Informational links/status; 7.19:1 on white. |
| Danger | `#A33B32` | Report/destructive/error text; 6.50:1 on white. Pair with clear labels and confirmation where needed. |
| Divider | `#DDE5DC` | Structural border; keep it visible enough to distinguish fields and table boundaries. |

Use the same state meanings throughout the public, UMKM, and admin interfaces. Do not use color alone for verification, purpose, claim state, expiry, or urgency. Keep citrus out of small text and reserve the amber tone for time-sensitive states rather than decoration.

### Typography proposal

- Use **Inter** as the current native FigCraft family for all documented text roles. The native styles are `Type/Display` (30 px Bold), `Type/Body` (16 px Regular), `Type/Caption` (14 px Medium), and `Type/Section label` (13 px Bold). Use at least 16 px for mobile body copy; 14 px is for supporting text, not long-form body content. Confirm font delivery and fallback behavior during implementation.
- Set a clear heading scale; body copy remains at least 16 px on mobile with line-height of at least 1.5. Keep labels, helpers, and inline errors visibly distinct and programmatically associated.
- Use tabular numerals for portions, times, and countdowns where supported. Keep units and WIB explicit; avoid tiny uppercase metadata and arbitrary monospace styling.
- Prefer a system-font fallback and efficient/self-hosted font delivery if that fits the implementation; do not make core readability depend on a remote font load.

### Layout principles

- Treat 360–1920 px as the design range; mobile portrait is a first-class context, even though the product is a responsive web application.
- Use the specified 4 px base rhythm and 8/12/16/24/32 px spacing. Choose breakpoints by content fit; tablet breakpoint values remain open.
- Let grouping, alignment, and spacing lead. Use cards where each item is independently actionable (food listings, claims, queue records); avoid nested panels and repeated identical containers.
- On recipient feed, keep the most decision-relevant fields visible in the listing. On detail, place the claim action beside the facts that inform the decision. For mobile, use an accessible filter sheet only for confirmed filters.
- UMKM Posting Cepat is one desktop screen and two steps on mobile, per the design brief. Prioritize defaults, limited typing, consistent field groups, and inline recovery. Do not compress required safety facts to hit a time target.
- Admin queues can use compact tables on wide screens and stacked records on small screens. Keep actor, status, timestamp, reason, and next action associated where the underlying requirement supports them.
- Do not introduce an arbitrary multi-column “bento” layout, a dashboard hero, fake KPIs, or fabricated impact statistics.

### Component principles

- Use a consistent control height, padding, and focus geometry per role; text buttons for consequential actions; clear destructive separation; and 44×44 CSS px minimum touch targets.
- Use shared primitives for buttons, fields, inline errors, listing cards, detail metadata, verification and purpose labels, status, pickup deadline, dialogs, alerts, empty/loading states, report forms, and responsive work rows.
- A verified badge describes UMKM verification only. A safety attestation describes what the UMKM declared; neither implies a food inspection by SIPANA.
- Purpose labels and statuses use concise text and, where useful, an icon. Ensure labels do not depend on color, shape, or hover for meaning.
- Preserve entered values on validation errors. Explain whether a claim or post succeeded after a network interruption and offer safe retry behavior.
- Keep action labels concrete: “Klaim makanan”, “Posting sisa”, “Konfirmasi serah terima”, “Laporkan masalah”. Do not introduce unsupported marketing or moralizing language into operational UI.

## Reference mapping

| Source | What it contributes | How this direction uses it |
|---|---|---|
| [`docs/PRD.md`](PRD.md) | Primary product truth: roles, goals, core features, user stories, journeys, safety/trust rationale, responsive and accessibility requirements, and explicit scope boundaries. | Governs functionality, vocabulary, priorities, and exclusions. Conflicts are surfaced below rather than silently designed around. |
| [`docs/design-brief.md`](design-brief.md) | UX-ready IA, feature priorities, responsive layouts, component requirements, WCAG 2.1 AA details, and 17 documented decision gaps. | Main implementation guidance; its unresolved decisions remain open. It also establishes the green-forward palette role but leaves exact values to visual design. |
| [`docs/sipana_dokumen_desain_sistem.md`](sipana_dokumen_desain_sistem.md) | Product requirements and earlier UI recipes, including a superseded soft-blue palette and Plus Jakarta Sans/Quicksand proposal. | PRD-derived behavior remains useful; visual values in its old §12 recipes are historical. Current tokens and brand usage are in [`brand-identity-guidelines.md`](brand-identity-guidelines.md), [`design-system-migration-status.md`](design-system-migration-status.md), and the native FigCraft file. |
| [`docs/sipana-complete-ui.figcraft`](sipana-complete-ui.figcraft) | Native source with design-system foundations and public, recipient, UMKM, and admin screens; green, citrus, and paper interface palette. | Current visual implementation reference. Official PNG brand assets are used in light contexts; dark surfaces retain a documented white text fallback because no inverse artwork exists. |
| [`docs/sipana.figcraft`](sipana.figcraft) | Minimal local FigCraft package containing only a document name and Page 1. | No usable visual direction or screen content found. Read-only; no FigCraft MCP call or modification. |
| `docs/design-reference/` | No design-reference directory or image files were present during this audit. | No external visual reference was used. The actual SIPANA PNG logo assets and PRD/design documents informed the review. |
| [`apps/web/src/pages/landing.jsx`](../apps/web/src/pages/landing.jsx) | Current landing component is empty. | No established visual behavior to preserve; the design brief and PRD remain the authorities. |

## Accessibility and responsive considerations

- Target **WCAG 2.1 AA** across public and authenticated screens. Normal text contrast is at least 4.5:1; large text and UI components at least 3:1. Verify final color pairs, focus indicators, hover, disabled, and error states—not only the proposed default palette.
- Provide keyboard-operable controls, visible focus of at least 2 px and 3:1 contrast, semantic landmarks, accessible names, and programmatic field/error associations. Check with NVDA + Chrome and TalkBack + Android Chrome as specified by the brief.
- Maintain 44×44 px touch targets, mobile body text of at least 16 px, and no horizontal scrolling in primary flows at 360 px. Support 1920 px desktop without overly long text lines.
- Convey availability, verification, purpose, claim, expiry, and urgency with text plus visual cues; never color alone. Announce asynchronous claim, expiry, and verification updates through accessible live regions.
- Show time-sensitive context as readable pickup times and status. Do not rely on animated countdowns; respect reduced-motion preferences and leave enough time/context for decisions.
- Keep focus order and primary actions intact when navigation changes from desktop top/side navigation to mobile bottom tabs. Make filter sheets, dialogs, queues, and error recovery keyboard/touch accessible.
- Use Bahasa Indonesia plain language and preserve user input on validation or network failure. Privacy and legal wording must not overstate what the service does.

## Unresolved decisions to carry forward

The direction intentionally does not settle product behavior where the PRD and design brief conflict. Resolve these before detailed interaction design or implementation:

### P0 behavior and safety decisions

1. **Purpose options:** FR-021 says “konsumsi”, “redistribusi”, or “pakan ternak”; the data model instead offers “konsumsi manusia”, “pakan ternak”, or “keduanya”. Choose one canonical set and user-facing labels.
2. **Claim quantity and quota:** define portions per claim, active-claim maximum, claim granularity, and whether one claim removes a listing or remaining portions stay available. PRD text and data model conflict on single versus multiple claims.
3. **Handover confirmation:** clarify whether UMKM alone confirms, both parties confirm, or the system confirms; define disputes and non-response handling.
4. **Cancellation and no-show:** define who may cancel and when, whether stock reopens, how quota is restored, and whether a penalty/cooldown exists.
5. **Pickup data and privacy:** schema lists only pickup deadline/address while FR-020 requires start and end. Define stored window, whether exact address is public or claim-gated, and when contact information is revealed.
6. **Listing photos and category:** decide whether a photo is required, optional, or excluded in pilot; reconcile upload constraints with the journey that permits publishing after photo failure. Confirm category options.
7. **Recipient terms:** determine whether recipients accept terms, at what point, and which terms apply; current requirement explicitly gates UMKM posting only.
8. **Reports:** define who may report which listing, handover, or user, and the allowed reason categories.
9. **Identity/login:** settle the unique login identifier and whether email, phone, or both are required and verified.
10. **Food-safety language:** review attestation, disclaimer, and liability terms with the appropriate legal/product owner. Visual design can expose facts and declarations, but should not imply SIPANA guarantees safety.

### P1 scope and presentation decisions

- **Discovery controls:** map, radius, search, category and pickup-window filters appear in UX text but are not all supported by the FRs. District filtering is P1; purpose filtering is P2. Keep unconfirmed controls out of the committed interface.
- **Notifications:** channel requirements differ across email, in-app, and WhatsApp. Keep visual components channel-neutral until delivery behavior is finalized.
- **Impact metrics:** define whether UMKM gets its own impact recap and which metrics it can truthfully show. Do not show kilograms or broad social impact without a supported conversion and measured data.
- **Admin scope:** user-management operations and platform metric definitions are incomplete; avoid designing controls or metrics not specified.
- **Privacy retention:** reconcile personal-data, document, listing, notification, and audit retention periods and the user-facing deletion request process.
- **Brand and delivery:** the approved green/citrus system supersedes the soft-blue concept. Final font loading, content-fit breakpoints, and legal copy still need implementation/product confirmation.

## Review checklist for the next design stage

- Does the available food listing, pickup time, purpose, and verified giver dominate the recipient’s first decision?
- Can an UMKM return to “Posting Cepat” and publish on a phone with minimal repeated entry?
- Are the handover facts visible without implying that SIPANA inspected the food?
- Do recipient, UMKM, and admin interfaces feel related but serve their distinct jobs?
- Does each component earn its container, accent color, badge, or motion?
- Can all key states be understood without color, hover, or animation?
- Does the design remain usable at 360 px and short viewport heights with real Bahasa Indonesia content?
- Would removing the handover-record treatment lose useful context or identity? If not, simplify it.

