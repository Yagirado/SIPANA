# Community Pages and Workflows Implementation Plan

> **For agentic workers:** Execute this plan inline in order; the user explicitly requested implementation. Automated tests are omitted because the repository task instructions prohibit adding or running tests unless requested.

**Goal:** Build the community member's discovery, claim, report, and profile pages with persistent, role-protected Laravel APIs.

**Architecture:** Laravel owns listing visibility, one-claim-per-listing reservation, pickup expiry, report ownership, and profile validation. React Router pages use the shared API client, protected community routes, shared dashboard shell, and explicit loading/error/empty/success states.

**Tech Stack:** React 19, React Router, Tailwind CSS 4, Laravel 13, Sanctum, Eloquent, MySQL.

---

## Product rules

- One claim reserves the entire listing; each listing can be claimed once.
- A claim cannot be cancelled by the recipient. It expires when the pickup window ends.
- No global active-claim quota is enforced because the PRD does not define its value.
- Listing and claim pages must use persisted records; do not seed fake food data.
- Feed and listing details remain public. Claim creation, claim history, profile, and report history require the `community` role.
- Profile exposes the member's email read-only; editable data is name, phone, gender, birth date, and district.
- Reports accept a category and optional detail; reporter identity stays private to other users.

## Task 1: Listing and claim domain

**Files:** Create listing/claim migrations, `Listing` and `Claim` models, and a community API controller. Modify `routes/api.php` for public listing reads and community-only dashboard/claim endpoints.

- [ ] Persist listing safety, pickup, purpose, district, quantity, owner, and lifecycle fields.
- [ ] Persist one claim per listing with an active/completed/expired state.
- [ ] Expire past-due published listings and active claims before reading/claiming.
- [ ] Reserve a listing inside a transaction with a row lock and return a conflict when already reserved.
- [ ] Return only public UMKM/listing data; never return a recipient's phone to public callers.

## Task 2: Community reports and profile

**Files:** Create report migration/model and API request/controller; add community profile read/update endpoints.

- [ ] Store listing or own-claim reports with category, optional description, reporter, and open state.
- [ ] Restrict claim reports to claims owned by the signed-in community member.
- [ ] Validate profile updates on the server and return only the current user's profile.

## Task 3: Community web pages

**Files:** Create reusable listing card and page components for feed/detail, claims, reports, and profile. Modify `App.jsx`, community navigation, and dashboard overview.

- [ ] Implement public `/jelajahi` and `/makanan/:listingId` pages with district filtering and honest empty states.
- [ ] Implement protected community home, claim list/detail, report history/form, and profile routes.
- [ ] Connect pages to the APIs and retain the user's current route after login where a claim requires authentication.
- [ ] Keep desktop sidebar and mobile four-item bottom navigation usable at 360 px.

## Task 4: Documentation and verification

**Files:** Update `docs/design-brief.md` to record the claim policy chosen by the user. Verify changed frontend with lint/build; verify PHP syntax, migrations, and route registration without running automated tests.

- [ ] Apply additive migrations to the configured local database.
- [ ] Confirm frontend lint/build, PHP syntax, Laravel migration status, and declared routes.
- [ ] Record any UI/browser verification limitation; do not claim routes were visually reviewed if the browser is unavailable.
