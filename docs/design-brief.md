# SIPANA Product Design Brief

**Source:** `docs/PRD.md` (version 1.0, draft for stakeholder review)  
**Prepared:** 7 November 2026  
**Purpose:** Implementation-ready UX, information architecture, screen, responsive, and design-system guidance.  
**Status:** Design direction approved; open PRD decisions remain identified below.

## 1. Product overview

SIPANA (Sistem Informasi Pangan Berlebih) is a free web platform for verified culinary UMKM in Karawang Regency to publish edible surplus food and for community members to discover and claim it for pickup. The initial pilot is limited to Karawang Barat, Telukjambe Timur, and Karawang Timur. The product makes safe and traceable handover the organizing principle: each listing identifies its giver, quantity, preparation time, pickup window, intended purpose, and safety attestation; reports and reciprocal handover confirmation provide accountability.

The experience serves three distinct roles through a shared visual system: community member/recipient, UMKM/giver, and admin. Public visitors may browse without registering. The web product is responsive; a native mobile app, delivery, payments, monetary donations, and areas outside Karawang are out of scope.

### Product goals and success measures

- Build a verified UMKM supply base and enable fast, low-friction posting.
- Convert surplus listings into completed, traceable handovers.
- Help residents find available food nearby and claim it fairly.
- Establish trust through visible safety context, UMKM verification, reporting, and audit records.
- Support impact measurement through listing, claim, completion, portion, period, and district records.
- Design for the PRD targets: listing feed and dashboard performance on 4G; ≤3 taps to reach fast posting and ≤45 seconds median publish time; ≥95% of live listings with complete safety metadata; WCAG 2.1 AA; 360–1920 px responsive support.

Survey percentages in the PRD are directional evidence from a small, non-probability sample (n=25), not general population estimates.

### Business goals carried into product measurement

| Goal | PRD target | UX/data implication |
|---|---|---|
| Verified supply (G1) | 100 verified UMKM by launch; 400 by launch + 6 months; ≥80% of approved UMKM publish a first listing within 14 days. | Verification queue and state need to be clear and measurable; onboarding should minimize posting friction. |
| Completed redistribution (G2) | 500 kg in first full post-launch month; 3,000 kg/month by +6 months; ≥70% of published listings completed. | Completion status and quantity are essential; weight measurement/portion conversion is not defined and must be specified before showing kg totals. |
| Active public demand (G3) | 1,000 registered users and 300 MAU by +3 months; 5,000 registered and 1,500 MAU by +6 months; ≥15% claim conversion from detail views; ≥25% 30-day retention. | Feed, detail, and claim events need analytics instrumentation; do not add analytics UI to end users without a requirement. |
| Trust and reliability (G4) | ≥99.5% uptime 06:00–22:00 WIB; median page load ≤3 s on 4G; ≥95% live listings with complete safety metadata; zero unresolved missing-disclosure incidents per quarter. | Safety metadata completeness, listing validation, and clear system status are central. PRD goal text includes allergens, but FR-020 does not require an allergen field. |
| Operational reporting (G5) | Automated monthly impact report delivered in every month from +1 month. | Admin export is specified; report delivery automation/channel is not fully designed. |
| Acquisition efficiency (G6) | Cost per verified UMKM ≤ IDR 50,000 by +6 months. | Operational KPI; no corresponding user-facing feature specified. |
| Verification operations (G7) | Median submission-to-decision ≤48 hours by +3 months. | Queue age and decision timestamp may support admin operations; no SLA display requirement is specified. |

## 2. Roles, access, and permissions

| Role | Access and permissions | Restrictions / states |
|---|---|---|
| Public visitor | View the public feed, listing details, and public listing links; browse without UMKM registration. | Cannot claim until registered/authenticated as a community member. Public views must not expose personal contact data. |
| Community member / recipient | Register with name, contact, district, and password; sign in; browse/filter; claim eligible listings; view own active claims and history; cancel where permitted; report listing or handover/user concern; manage allowed profile fields and notification preferences. | Cannot post or confirm handover. Subject to configured active-claim quota, duplicate prevention, listing availability, and no-show rules. Only necessary counterparty data may be disclosed after a claim according to the final privacy rule. |
| Community member acting as redistributor (P3 persona, not a separate auth role) | Use the community-member account to claim for others and redistribute within the listing’s declared purpose, where the final claim rules allow it (US-13). | PRD does not define how a claim represents multiple recipients, quantity split, or proof of downstream redistribution; do not imply separate organization accounts or workflows. |
| UMKM / giver | Register with owner/contact and business details; submit verification information/documents; see verification state/reason; manage permitted profile fields; publish, edit before claim, withdraw unclaimed listing; share listing to WhatsApp; see own listings and incoming claims; confirm handover; report an issue; view own impact summary as supported by the UX section. | Pending, rejected, or suspended UMKM cannot publish. Business-identity edits can return account to pending. Handover confirmation is limited to the owning UMKM or system. |
| Admin | Sign in to a separate authenticated area; review/approve/reject UMKM and record reasons; review reports and dismiss, warn, suspend, or remove listing; access audit log; view impact recap by period/district and export structured data. | Admin actions require actor, timestamp, and reason where specified; actions are auditable. The PRD names user management and platform metrics in the navigation but does not define their exact operations or metrics. |

**Account-state treatment:** pending verification, verified, rejected (show reason and resubmission path), suspended, and session expired. Role checks are enforced server-side; denied access should return the user to a relevant allowed destination with a plain-language explanation.

## 3. Feature inventory and priority

Priorities below follow the FR section: P0 = Must-have, P1 = Should-have, P2 = Nice-to-have. Listing categories, purposes, statuses, and exact policy values must ultimately follow one canonical source (see §11).

| Area | Features and requirement IDs | Priority |
|---|---|---|
| Accounts and access | UMKM registration (FR-001); community registration (FR-002); authentication/session (FR-003); role separation (FR-004); UMKM terms acceptance (FR-005); verification status display (FR-006); profile editing and re-verification behavior (FR-007). | P0, except FR-006 P1, FR-007 P2 |
| Verification and trust | Per-listing safety attestation (FR-010); verified badge on cards/detail (FR-011); admin approval/rejection workflow (FR-012). | P0 |
| Listing management | Create listing with quantity, food type, cooking time, pickup window, and purpose (FR-020); required purpose label (FR-021); edit unclaimed listing (FR-022); withdraw unclaimed listing (FR-023); automatic expiry (FR-024); WhatsApp share link (FR-025). | P0 core; edit/withdraw P1; WhatsApp P2 |
| Discovery | Public available-listing feed (FR-030); district filter limited to pilot (FR-031); pickup-window display (FR-032); listing detail (FR-033); purpose filter (FR-034). | Feed, window, detail P0; district P1; purpose P2 |
| Claims and handover | Claim and pickup details (FR-040); quota enforcement (FR-041); duplicate prevention and atomic concurrent resolution (FR-042, FR-070); owner handover confirmation (FR-043); no-show handling (FR-044); expired-claim cleanup/quota release (FR-072). | Claim, quota, duplicate prevention P0; no-show/cleanup P1 |
| Safety and moderation | Member report with reason category and optional text (FR-050); admin report actions and notifications (FR-051); publishing validation and suspended-account gate (FR-052). | Reporting P0; admin handling/moderation P1 |
| Administration and impact | Admin recap by period/district (FR-060); structured export (FR-061); admin audit log (FR-062); claim outcome notifications (FR-073); privacy and contact visibility (FR-074). | Impact/admin and notifications P1; privacy P0 |
| Cross-cutting | Pilot-district restriction (FR-071); performance, security, accessibility, browser/network support, PWA baseline, observability and other NFRs in PRD §7. | As defined by their NFRs |

Features mentioned in UX guidance but not given a functional requirement (for example, optional feedback, map/list hybrid, radius/category search, photo upload, email notifications) are not assumed to be committed scope. They are marked as unresolved or optional in this brief.

## 4. Information architecture

### Public and community-member area

```text
Public
├── Landing / value proposition (P1)
├── Available listings (public feed)
│   ├── Filters: pilot district (P1); purpose (P2); other filters only if confirmed
│   └── Listing detail
├── Register / sign in
├── Terms and conditions
└── Community member (authenticated)
    ├── Beranda (nearby/current listings)
    ├── Jelajahi (PRD-proposed map/list view; confirm map/radius scope)
    ├── Klaim Saya
    │   ├── Active claim / pickup details / countdown
    │   └── Claim history and status
    ├── Report flow / report history
    └── Profil / notification preferences / terms status
```

Desktop uses top navigation for public/recipient screens; mobile uses a bottom tab bar for Beranda, Jelajahi, Klaim Saya, and Profil. The landing page and public feed remain browsable without an account; registration is requested at the claim boundary.

### UMKM area

```text
UMKM (authenticated)
├── Dasbor
│   ├── Posting Cepat
│   ├── Active listing summary
│   ├── Incoming handovers requiring action
│   └── Impact summary
├── Listing Saya
│   ├── Active / claimed / expired / completed / withdrawn history
│   └── Listing detail and eligible edit/withdraw actions
├── Klaim Masuk
│   └── Claim detail → confirm handover / report issue
├── Laporan Dampak (P1 if released)
└── Profil & Verifikasi
    ├── Business profile and permitted edits
    ├── Verification submission/status/reason
    └── Terms acceptance status
```

Desktop uses a left sidebar; mobile uses a bottom tab bar. Posting Cepat is the most prominent dashboard action. Keep status and next action visible without requiring users to understand internal state names.

### Admin area

```text
Admin (separate authenticated area)
├── Verification queue → application review → approve / reject with reason
├── Reports / moderation queue → report detail → dismiss / warn / suspend / remove
├── User management (listed in PRD UX navigation; actions undefined)
├── Impact recap → period/district view → export
├── Audit log
└── Platform metrics (listed in PRD UX navigation; metrics undefined)
```

Use a desktop-oriented table/work-queue pattern with usable narrow-screen behavior. Do not infer bulk operations, advanced search, or additional admin controls until requirements are defined.

## 5. User flows

Flows show the intended UI sequence and the requirements they cover. Global system enforcement (authorization, race handling, expiry, privacy) is required even where it is not represented as a separate screen.

### 5.1 Public discovery and account entry (FR-002, FR-030–034)

1. Visitor opens landing page or public listing feed.
2. Feed shows only active, unclaimed, unexpired, non-withdrawn listings and the required card data: food type, available quantity, pickup window, purpose, and verified giver badge.
3. Visitor optionally chooses a pilot district; purpose filter is available only if P2 scope is implemented. Any additional category/radius/search controls require confirmation.
4. Visitor opens listing detail to see all listing fields, cooking time, giver identity/name, pickup details, purpose, verification, and report affordance.
5. On Claim, visitor is routed to sign in/register as a community member, then returned to the listing if still available.
6. Empty, loading, unavailable, and expired states explain what happened and provide a relevant browse path.

### 5.2 Community member registration, sign-in, and session (FR-002–004, FR-007)

1. Select community member registration; enter name, contact, district, password.
2. Validate required values and duplicate contact; show inline corrective errors without losing input.
3. Successful registration grants access to browse and claim flows.
4. Sign-in accepts credentials; invalid credentials use a generic error; inactivity expiry returns to sign-in and preserves a safe return destination.
5. Profile screen exposes only permitted profile fields and notification preferences once the latter are specified.

### 5.3 UMKM registration and verification (FR-001, FR-005, FR-006, FR-012)

1. Select UMKM registration; enter owner/contact, business name/type, pilot district/address, and credentials; upload required verification documents as defined by the registration requirements/schema.
2. Submit creates a pending account. Show confirmation and explain that posting is unavailable until review.
3. Admin opens pending queue, reviews submitted information, then approves or rejects with recorded reason.
4. UMKM sees status and, if rejected, the reason and resubmission route; approval enables listing creation.
5. If business identity fields change, explain that re-verification is required and status returns to pending.
6. On first posting, require current terms acceptance and record version and timestamp.

### 5.4 Create a listing with Posting Cepat (FR-010, FR-020–021, FR-071)

1. Verified UMKM chooses Posting Cepat from dashboard. Target: ≤3 taps to the form and ≤45 s median publish time; returning user completion is also specified as ≤2 minutes.
2. Present a compact form with profile-derived district/address and any confirmed defaults. Required: food type, quantity ≥1, cooking/preparation time (not in future), pickup start/end (end after start), one purpose label, and required safety declaration. Use a single desktop screen and a two-step mobile flow as the PRD specifies.
3. Restrict district to the three pilot districts. Validate before publish and retain form values after errors.
4. If photo is confirmed as optional scope, allow it without blocking publish when upload fails; otherwise omit it. The PRD conflicts between an optional-photo journey and FR-020/schema requirements and NFR upload constraints.
5. Publish → show success confirmation, active listing status, and WhatsApp share action only if supported. Include a pre-filled public link in the share action.
6. Pending/rejected/suspended UMKM, unaccepted terms, invalid safety fields, or out-of-area listing receives a clear blocking explanation and next step.

### 5.5 Edit, withdraw, expiry, and listing history (FR-022–024, FR-052)

1. UMKM opens Listing Saya and selects an eligible unclaimed listing.
2. Edit is available only before claim. Once claimed, explain why fields are locked and provide the supported claim cancellation path if that policy is confirmed.
3. Withdraw requires a clear confirmation; withdrawn listing disappears from public feed and remains in UMKM history.
4. At pickup-window end without completed handover, listing becomes expired and disappears from public results. Show expired state in history and impact recap.
5. Suspended UMKM cannot publish. Listings missing mandatory fields cannot be published.

### 5.6 Claim, quota, cancellation, and pickup (FR-040–042, FR-070, FR-072–074)

1. Authenticated community member chooses Claim from an available detail page.
2. Before committing, show the listing summary, pickup window/address or pickup details, purpose, the active-claim quota consequence, and a final confirm action. Terms timing for recipients is not clearly defined: PRD UX says first-time claim confirmation, while FR-005 refers to UMKM T&C only.
3. Server verifies availability and quota atomically. Exactly one concurrent claimant succeeds; other attempts see “already claimed” and can return to listings.
4. Successful claim creates a confirmation/active-claim screen, removes the listing from public feed per FR-040, and shows pickup instructions and time remaining. Notify parties if the P1 notification feature is in release scope.
5. Member can cancel only if cancellation is supported by the final rule. On cancellation, release listing and quota as specified; the current PRD journey mentions cancellation but FRs do not define actor, deadline, or exact behavior.
6. Mask contact details publicly. Reveal only the minimum necessary to the transacting counterparty at the approved point in the claim lifecycle.

### 5.7 Mutual handover, no-show, and dispute (FR-043–044, FR-050)

1. UMKM opens Klaim Masuk and claim detail for its own listing.
2. At pickup, UMKM confirms handover; record timestamp, close listing as completed, release quota, and update impact.
3. Recipient sees completed state and pickup record. Optional feedback appears only if confirmed as scope.
4. If deadline passes without confirmation, mark claim no-show, expire the listing, record it against recipient history, and release quota per configured policy.
5. Either party can report an issue through the report flow. If the PRD intends both parties to confirm handover, the matching recipient confirmation step is missing from FR-043 and must be decided before designing a two-sided confirmation UI.

### 5.8 Report and moderation (FR-050–052, FR-062)

1. Report is reachable from listing detail and relevant claim/handover record.
2. Reporter selects a required reason category (PRD examples: food safety, misrepresentation, inappropriate behavior, other) and may add free text.
3. Submit confirms receipt and flags the relevant listing/user for review. Protect reporter and counterparty data according to privacy rules.
4. Admin reviews queued report and chooses dismiss, warn UMKM, suspend UMKM, or remove listing; records reason and actor/time.
5. Removed listing disappears from feed immediately. UMKM and reporter receive outcome notification if notification channel is defined.
6. Admin and reporter see report status updates as supported; exact statuses and notification channel need confirmation.

### 5.9 Impact, export, and audit (FR-060–062)

1. Admin opens impact recap, selects a period and (optionally) one of the pilot districts.
2. Screen reports counts of listings published, claims made, and completed handovers; only completed handovers count as successful distributions.
3. Admin exports a structured file such as CSV; exported figures must match selected on-screen period and district.
4. Admin opens audit log to retrieve verification, moderation, and suspension actions with actor, action, timestamp, and reason.
5. UMKM impact summary/monthly impact report appears in PRD UX guidance but FR-060 only grants admin recap; recipient visibility and UMKM-specific metrics need confirmation before implementation.

### 5.10 Notifications and recovery (FR-006, FR-012, FR-051, FR-073, NFR-047, NFR-052)

- Communicate verification decision, claim outcome/cancellation, handover, and moderation outcome to relevant parties where required.
- Keep channel-neutral notification UI until email, in-app, and/or WhatsApp delivery is decided. PRD describes email/in-app in some flows, in-app + WhatsApp in technical guidance, and leaves channel as TBD in its appendix.
- Network or write failure keeps user-entered data where safe, explains whether the action succeeded, offers retry, and avoids duplicate claims/submissions. Core browse, claim, and confirmation should tolerate intermittent 3G connectivity.

## 6. Screen and page inventory

Priority labels mirror PRD §8.5 when present. Additional rows are necessary states or page breakdowns of named functionality; they do not imply new features.

| # | Screen/page | Audience | Priority | Main content/actions and key states |
|---:|---|---|---|---|
| 1 | Landing / value proposition | Public | P1 | Product purpose, entry to listing feed, sign-in/register. |
| 2 | Public listing feed / recipient Beranda | Public/member | P0 | Available cards, required metadata; loading, empty, unavailable/error. |
| 3 | Explore / map-list | Member | Unclear | Explicitly named in IA, but map/radius behavior is not covered by FRs; confirm before implementation. |
| 4 | Filter controls/results | Public/member | Mixed | District filter P1; purpose filter P2; category/radius/pickup filtering mentioned in UX but not fully required. |
| 5 | Listing detail | Public/member | P0 | Food type, cooking time, quantity, pickup window, purpose, UMKM name/badge, claim and report; claimed/expired state. |
| 6 | Role choice / registration entry | Public | P0 implied | Route to community or UMKM registration; precise role-selection requirement is not separately specified. |
| 7 | Community registration | Public | P0 | Name, contact, district, password; validation and duplicate-contact error. |
| 8 | UMKM registration / document submission | Public | P0 | Owner/contact, business data, pilot district, password, required documents; submit/error/success. |
| 9 | Sign-in | All roles | P0 | Credentials, generic invalid-credential message, role-specific redirect. |
| 10 | Terms and conditions | UMKM; recipient timing TBD | P0 | Versioned acceptance; UMKM must accept before first listing. Recipient first-claim acceptance is unresolved. |
| 11 | Verification pending/status | UMKM | P0/P1 | Pending, verified, rejected with reason, suspended; resubmit where allowed. |
| 12 | UMKM dashboard | UMKM | P0 | Posting Cepat, active listing, incoming handover actions; summary metrics only where confirmed. |
| 13 | Posting Cepat form | UMKM | P0 | Required listing fields, attestation, defaults, validation; desktop single screen/mobile two-step. |
| 14 | Listing published confirmation | UMKM | P0 | Success state, listing status, share action if WhatsApp scope is enabled. |
| 15 | My listings and listing history | UMKM | P0 | Active/claimed/expired/completed/withdrawn, eligible edit/withdraw, empty/loading states. |
| 16 | Edit listing | UMKM | P1 | Only unclaimed listings; save/cancel/validation. |
| 17 | Withdraw confirmation/result | UMKM | P1 | Confirm withdrawal, remove from feed, preserve history. |
| 18 | Claim confirmation | Member | P0 | Listing and pickup recap, quota-aware confirm, success/already claimed/quota exceeded. |
| 19 | My claims — active | Member | P0 | Pickup details, countdown, claim status, supported cancellation. |
| 20 | My claims — history | Member | P0 | Completed, cancelled, no-show, expired records; filters not specified. |
| 21 | Incoming claims | UMKM | P0 | Claims awaiting handover; empty state and relevant status. |
| 22 | Claim/handover detail | UMKM/member | P0 | Pickup details, permitted contact visibility, confirm handover, report. |
| 23 | Handover confirmation dialog/result | UMKM | P0 | Confirm action, completed state, timestamp/impact update. |
| 24 | No-show/expired claim state | Member/UMKM | P1 | Deadline passed, status, quota resolution; no-show consequence policy TBD. |
| 25 | Report form and receipt | Member/UMKM | P0 report; P1 handling | Reason category, optional text, confirmation; listing/claim/user target. |
| 26 | Profile | Member/UMKM | P1 | Editable permitted fields; UMKM business edits can trigger re-verification. |
| 27 | Notification preferences/inbox | Member/UMKM | P1/TBD | Named in navigation, but channel, preference controls, and inbox behavior unspecified. |
| 28 | UMKM impact report | UMKM | P1 in UX inventory | Monthly portions, fulfilled claims/categories per UX text; exact permission and measures TBD. |
| 29 | Admin verification queue | Admin | P0 | Pending applicants, review action, empty/loading/error. |
| 30 | Admin verification detail | Admin | P0 | Submitted data/documents, approve/reject with reason, audit outcome. |
| 31 | Admin report queue | Admin | P1 | Open/reviewing/resolved/dismissed status as data model indicates; report detail/actions. |
| 32 | Admin report review/action | Admin | P1 | Dismiss, warn, suspend, remove listing; reason and confirmation. |
| 33 | Admin user management | Admin | P1 listed | Page named in UX; operations, fields, and permission model are unspecified. |
| 34 | Admin impact recap | Admin | P1 | Counts by period and district; loading/no-data/error. |
| 35 | Admin export | Admin | P1 | Select/export recap; success/failure feedback; CSV example. |
| 36 | Admin audit log | Admin | P1 | Filter/retrieve logged decisions; filtering and retention period unresolved. |
| 37 | Admin platform metrics | Admin | Unclear | Named in UX navigation; metric definitions and permissions unspecified. |
| 38 | Offline cached listing / install guidance | Public/member | NFR-053 | Cached last-viewed detail is read-only offline; show last-known context and connection state. No offline claim/post writes. |
| 39 | Privacy consent and data request entry | All roles | NFR-019 | Registration includes explicit consent; provide a discoverable route for deletion-on-request workflow. Exact confirmation, retention exceptions, and request status behavior need product/legal definition. |
| 38 | Access denied / session expired | All roles | Cross-cutting | Explain access/session state and route back to sign-in or allowed home. |

## 7. Design system

Use one shared component library with role-specific navigation and page composition. Keep visual hierarchy calm and clear; prioritize safe pickup information and quick posting over decorative density. The PRD specifies design direction, but not exact brand values. The tokens below define what is known and what needs a design decision.

### 7.1 Color

| Token role | PRD direction | Design requirement |
|---|---|---|
| Primary | Green-forward, associated with food/freshness/sustainability | Choose actual hue and shades during visual design. Verify text and control contrast. Do not infer specific hex codes from survey or business rules. |
| Neutrals/surfaces | White and neutral surfaces are referenced | Define page, card, border, muted text, and disabled surfaces; ensure text readability. |
| Success | Claim confirmed / handover complete | Pair color with explicit status text and, where useful, icon. |
| Warning | Pickup deadline approaching / pending attention | Pair color with text such as deadline/status, not color alone. |
| Danger | Report action / expired or destructive state | Reserve for destructive or safety-relevant actions and errors; confirmation for irreversible actions. |
| Information | Verification pending | Always include a textual status. |

Normal text contrast ≥4.5:1; large text and UI components ≥3:1 (NFR-041). Color must never be the only status cue. Build and document tested token pairs before implementation.

### 7.2 Typography

- Use a legible sans-serif family with a modular H1–H4 hierarchy; exact family and scale are not specified in the PRD and remain a visual decision.
- Body copy is in Bahasa Indonesia, plain language at approximately grade-eight readability (NFR-045).
- Mobile body text minimum 16 px; body line-height at least 1.5.
- Keep form labels, required-field markers, helper text, and errors visually distinct and programmatically associated.
- Use tabular numerals for portion counts, times, and countdowns if supported by the chosen font; this is a usability recommendation, not a separate PRD requirement.

### 7.3 Spacing, shape, and layout

- Base spacing unit: 4 px; use the PRD rhythm of 8, 12, 16, 24, and 32 px.
- Use consistent content widths, card padding, form gaps, and section spacing; exact radius, elevation, and breakpoint values are not defined by the PRD.
- Keep listing cards scannable: food type/title, quantity, pickup window, purpose, verified giver. Put safety and time context close to the claim action on detail.
- Touch targets ≥44×44 CSS px (NFR-044); visible keyboard focus outline ≥2 px and ≥3:1 contrast (NFR-042).

### 7.4 Reusable components

**Core:** app shell and role navigation; page header; primary/secondary/ghost/danger buttons; labeled text/number/date-time/select controls; inline field errors; listing card; listing detail metadata group; verification badge; purpose/status badges; countdown/deadline indicator; confirmation dialog; toast/alert; empty state; skeleton/loading state; pagination or incremental feed loading (implementation choice); report form; responsive table/list row; audit record row.

**Interaction rules:**

- Critical actions have visible text labels; never rely on icon alone for destructive or safety-relevant actions.
- Disable or explain ineligible actions (unverified posting, claimed-listing edit, claim at quota).
- Preserve values on validation failure. Announce asynchronous status and expiry changes to assistive technology.
- Confirm handover and withdrawal with a concise summary of the consequence.
- Provide clear success, failure, retry, and already-completed feedback for claim and publish actions.

### 7.5 Content and localization

- UI copy is Bahasa Indonesia throughout public, recipient, UMKM, and admin surfaces.
- Use established domain labels consistently: *jam masak*, *batas ambil*, *peruntukan*, *kuota klaim*, *konfirmasi serah terima*, *kecamatan*.
- Avoid presenting unconfirmed “safe” assurances as platform guarantees. Show giver attestation and factual listing metadata; the final legal wording requires review.
- Format date/time in WIB and quantity as portions; exact format conventions should be set once and used consistently.

## 8. Responsive requirements

The product is a responsive web application, not a native mobile app. Design and validate across 360–1920 px (NFR-051), with mobile portrait as a first-class usage context and desktop as the specified landscape web layout. The PRD does not define formal breakpoint values; choose them based on content fit and document them in implementation tokens.

| Device class | Layout and navigation | Priority behavior |
|---|---|---|
| Mobile (360 px and up) | Single-column content. Recipient and UMKM use bottom tab navigation. Public feed cards stack; filters open in a compact, accessible sheet/panel. Admin queues become stacked records or horizontally scrollable data only where necessary. | 44 px touch targets; ≥16 px body text. Posting Cepat is a two-step flow. Keep pickup window, purpose, quantity, and main action visible without horizontal scrolling. Countdown and error updates are announced accessibly. |
| Tablet (approx. 768–1024 px; breakpoint TBD) | Use a wider single column or two-column layout only when content remains readable. Retain mobile navigation until a wider layout is usable; avoid forcing desktop density. | Listing feed may use two columns if cards retain readable metadata. Forms may become single-screen when height/width allow. Admin queues can use compact tables with wrapped cell content. |
| Desktop (up to 1920 px) | Public/recipient top navigation; UMKM left sidebar; admin separate desktop work area. Use centered content bounds and multi-column feed/details where appropriate. | UMKM posting form in one screen; queue/detail layouts may use master-detail. Do not stretch text lines or card widths excessively. Keyboard navigation and focus order are complete. |

Responsive QA must cover 360 px, a representative tablet width, and desktop; latest two major versions of Chrome, Edge, Firefox, Safari, plus older Android WebView ≥ Chrome 90 with functional graceful degradation (NFR-050). Core flows must remain usable on throttled 3G/intermittent networks (NFR-052). The PRD specifies a PWA baseline: installable home screen and offline shell for last-viewed listing detail, with no offline writes (NFR-053). Include install guidance where the browser supports it, a clear offline/read-only state for cached detail, and retry messaging when online actions cannot complete.

## 9. Accessibility and interaction quality

- WCAG 2.1 AA across public and authenticated screens (NFR-040).
- Contrast thresholds as in §7.1; status uses text and color together.
- All actions keyboard reachable, with visible focus and no keyboard traps (NFR-042).
- Semantic landmarks, labels for icon-only controls, field/error associations, tested with NVDA + Chrome and TalkBack + Android Chrome (NFR-043).
- Touch targets ≥44×44 px (NFR-044); avoid placing essential information only on hover.
- Countdown, claim, verification, and expiry changes announced through accessible live regions; do not rely on color or animation alone.
- Respect reduced motion and provide adequate time/context for time-sensitive actions; exact timer policy is an open requirement.
- Inline errors in Bahasa Indonesia state the problem and corrective action without discarding valid input (NFR-047).

## 10. Design acceptance checklist

- Each P0 FR is represented by a screen, state, or explicit system feedback in §5–6.
- No user can reach role-restricted actions through navigation or direct URL; UI state reflects authorization.
- Public feed and details contain all required fields and never expose private contact data.
- Registration captures explicit privacy consent. A deletion-on-request workflow is required by NFR-019; the product/legal owner must define whether the user can initiate it in profile, what is deleted versus retained for audit/impact, and how completion is communicated.
- Posting captures every required field, purpose, and attestation; pending/rejected/suspended or out-of-area UMKM are blocked clearly.
- Claim flow communicates pickup facts and quota outcome, handles duplicate/concurrent claims, and has a clear already-claimed state.
- Handover, expiry, no-show, quota release, report, moderation, impact, and audit states have coherent user feedback.
- All screens use Bahasa Indonesia, design tokens, and accessible component patterns.
- Layout remains usable at mobile, tablet, and desktop widths; no horizontal scrolling for primary user flows.
- P1/P2 features are labeled and can be deferred without hiding P0 functionality.

## 11. Missing requirements, conflicts, and assumptions

These are source-document gaps, not design decisions made by this brief. Resolve the P0 items before finalizing detailed wireframes or implementation behavior.

| ID | Source ambiguity / missing requirement | Design handling / decision needed |
|---|---|---|
| D-01 (P0) | Listing purpose differs: FR-021 says exactly one of consumption, redistribution, or animal feed; data model uses human consumption, animal feed, or both. Glossary also says human vs animal feed. | Keep the field and badge in the UI; do not finalize options until product/data owner chooses one canonical enum and wording. |
| D-02 (P0) | Claim quota maximum and active-claim definition are TBD; no-show cooldown/penalty also TBD. | Show remaining quota or a clear quota-block message only after rules and values are defined. Do not invent a numeric cap or penalty. |
| D-03 (P0) | Handover is called “mutual” and “two-party” in the executive summary/glossary, while FR-043 allows UMKM (or system) to confirm; recipient-side confirmation is absent. | Current flow uses giver confirmation with recipient completion view. Confirm whether recipient must also confirm and how disputes/no response resolve. |
| D-04 (P0) | Claim cancellation is mentioned in Journey B, but FRs do not define who may cancel, before what deadline, how the listing is re-opened, or quota release. | Do not finalize cancellation control/confirmation copy until cancellation policy is specified. |
| D-05 (P0) | Pickup window is required as start/end in FR-020, but schema lists only pickup deadline and pickup address. | Confirm whether start time and pickup address are stored, and whether exact address is public, claim-gated, or shared manually. |
| D-06 (P0) | Food type/category schema lists kue_roti, makanan_matang, olahan; FR-020 only says food type. Photo is optional in UX journey but photo upload is specified in NFR. | Confirm category options and whether photo is optional, required, or excluded in pilot. Do not block listing on optional photo failure. |
| D-07 (P0) | Recipient T&C acceptance timing is unspecified; FR-005 is specifically an UMKM pre-posting requirement, while UX journey says recipient confirms terms on first claim. | Keep recipient T&C acceptance as a decision point; do not require it in the claim flow until terms and applicability are approved. |
| D-08 (P0) | FR-050 explicitly permits community members to report listing/handover; risk narrative and Journey D say any listing/user and reports in both directions. | Confirm whether UMKM may report recipients/users and add the allowed target types/reasons if so. |
| D-09 (P0) | Listing visibility after claim conflicts: FR-040 says a claim reserves the listing and it leaves the public feed; data model allows multiple claims up to portion_count. | Define whether listings are single-claim reservations or portion-level claims, and how remaining portions are represented. UI inventory assumes one successful claim removes the listing. |
| D-10 (P0) | Public registration fields say contact but do not settle email vs phone as unique login identifier; NFR-010 says email/password. | Confirm required/unique identifiers and contact verification. Keep copy and validation generic until decided. |
| D-11 (P1) | Notification channels conflict across UX (email/in-app), technical plan (in-app + WhatsApp), and appendix TBD. | Use channel-neutral notification component patterns; finalize channels/preferences before building settings or delivery copy. |
| D-12 (P1) | Exact design tokens are absent: brand hex colors, typeface, type sizes other than mobile body minimum, radii, elevation, breakpoint values. | Set these during visual design; validate contrast before adoption. This brief does not fabricate hex values. |
| D-13 (P1) | UX names map/list, radius/category/pickup filters and search, but FRs specify district filter P1 and purpose filter P2 only. | Treat unreferenced map/search/filter controls as unconfirmed; do not list them as committed release features. |
| D-14 (P1) | Admin user management and platform metrics are in navigation only; operations and metric definitions are absent. | Reserve IA slots; do not define controls/data until requirements are supplied. |
| D-15 (P1) | Impact recap is defined for admins by FR-060, but UX also lists UMKM monthly impact and dashboard impact summary. | Confirm whether UMKM sees personal impact data and which metrics (portions, claims, category, weight). Avoid promising kilograms unless measured. |
| D-16 (P1) | Terms legal content, liability and food-fitness wording require legal/faculty review; exact cancellation/report SLAs are not fully defined. | Show versioned acceptance and factual safety data; final legal copy and moderation timelines remain approval items. |
| D-17 (P1) | Retention policies conflict: appendix says listings/claims 24 months, KTP photos 90 days after decision, notifications 90 days, audit logs 36 months; A-08 calls audit and PII retention TBD. | Confirm retention schedule and communicate document handling/retention in onboarding and privacy notices. |
| D-18 (P2) | Optional recipient feedback appears in Journey B but has no FR or data model requirement. | Exclude from committed screens until specified. |
| D-19 | Survey findings have limited sample size and possible positive bias; food categories/timing may not generalize. | Treat as hypotheses and instrument pilot behavior; keep fields flexible where the PRD supports it. |
| D-20 (P1) | NFR-019 requires explicit privacy consent and deletion-on-request, but the screen inventory and account requirements do not specify consent wording, request initiation, identity verification, retention exceptions, or request status. | Include consent at registration and reserve a profile entry point for data requests; define legal copy and deletion/retention behavior before implementation. |

### Assumptions used to make the brief actionable

1. The three pilot districts are the only districts selectable for posting and filtering at pilot launch (FR-071).
2. Public browsing does not require a registered member account; claiming does (FR-002/030/040 and UX flow).
3. The first detailed screen pass should prioritize P0. P1/P2 navigation may be present only when those features are included in the pilot build.
4. The recipient and UMKM interfaces share tokens/components but retain separate navigation and home-page priorities.
5. Exact numeric breakpoints and token values are design-system decisions still to be made; accessibility thresholds are fixed by the PRD.
6. No unsupported delivery, payment, chat, social feed, public profile, ratings, or native-app functionality is introduced.

## 12. Traceability notes

The flows and inventory cover functional requirements FR-001–FR-074, including profile/terms, validation, status visibility, moderation, notifications, privacy, and concurrent/expiry edge cases. NFRs are translated where they affect interaction and presentation: performance/loading (NFR-001–009), security and privacy (NFR-010–019), reliability/operability feedback (NFR-020–033), accessibility/usability (NFR-040–047), compatibility/network/PWA (NFR-050–053). Infrastructure-only implementation constraints remain in `docs/PRD.md` and are not restated as visual UI requirements.

**Source of truth:** when this brief and the PRD differ, the PRD remains authoritative until its owners resolve the conflicts listed in §11. Update this brief and any downstream wireframes after those decisions.
