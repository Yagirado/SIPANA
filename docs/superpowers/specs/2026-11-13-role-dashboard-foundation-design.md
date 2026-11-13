# SIPANA Role Dashboard Foundation — Design

**Status:** Approved for implementation by the user on 13 November 2026.

## Goal

Provide a real role-aware entry into Admin, UMKM, and community dashboards using the existing React/Vite and Laravel/Sanctum stack. This first vertical slice establishes authentication, authorization, shared navigation, and truthful dashboard empty states. Listing, claim, verification, moderation, and reporting workflows remain later slices.

## Current state and constraints

- The web app uses React 19, Vite, Tailwind CSS 4, and React Router. Existing login and registration screens currently validate only in the browser.
- The Laravel API has a default `users` table with name, email, and password; Sanctum is installed and `/api/user` is the only authenticated API endpoint.
- There is no role field, no login/logout API, and no dashboard domain model or metrics endpoint.
- The PRD calls for role separation. It leaves the canonical email/phone login identifier unresolved; the existing database requires a unique email, so this slice uses email for authentication and does not represent phone login as working.
- Admin user management, platform metrics, UMKM domain data, and listing/claim workflows are not implemented. Their pages must say when data or functionality is unavailable rather than display fabricated records or totals.
- The current login route imports nonexistent `pages/feat-login/*` files; existing edited screens live in `pages/login/*`. Route wiring will be corrected while preserving these screens.

## Architecture

### Backend

- Add a `role` column to users with exactly three values: `community`, `umkm`, and `admin`. Existing users migrate to `community`; public registration cannot assign `admin`.
- Use Laravel Sanctum's first-party stateful SPA session flow: CSRF-cookie initialization, email/password login, authenticated user lookup, and logout that invalidates the session and CSRF token.
- Add role middleware and protect the existing user endpoint plus a role-aware dashboard overview endpoint. The overview response contains the authenticated account identity and role only; it does not invent business metrics.
- Keep role provisioning for administrators out of public registration. No default admin password or production demo account is seeded.

### Frontend

- Add one API client and an auth provider that owns the current session, loading state, login/logout, and API error messages.
- Build a reusable dashboard shell: role-specific navigation, page title, profile menu, content region, and visible status/empty states. Use the approved SIPANA colors, typography, and supplied official logo assets.
- Use a left sidebar on desktop for all roles, as requested in the latest brief. At narrow widths, collapse it into accessible role-specific bottom navigation for community and UMKM and a menu drawer for admin.
- Protect dashboard routes and redirect a signed-in user to the dashboard for their actual role. A user without the required role gets a clear access-denied state; client routing is not treated as a security boundary.
- Provide one overview page per role. Show identity and role from the API. For unavailable metrics or domain data, explain that the feature is not connected yet and provide no fake values or nonfunctional action buttons.
- Keep the existing public landing, legal pages, and registration forms. The login screen becomes a real email/password submission. Local-only registration confirmation must remain clearly distinct from account creation; registration API work is outside this slice.

## Data flow and states

1. On app start, the web client requests the Laravel CSRF cookie, then asks for the current authenticated user.
2. A 401 response leaves the visitor unauthenticated and routes protected-page visits to login. Network and server errors produce a retryable state rather than being mistaken for logout.
3. Login submits email and password with credentials and CSRF protection. A successful response supplies the user's role and redirects to that role's dashboard. Invalid credentials receive a generic error.
4. The server checks `auth:sanctum` and role middleware for protected endpoints. A wrong role returns 403 regardless of the frontend route.
5. Logout invalidates the session server-side before returning the browser to the public landing page.

## Error handling and accessibility

- Distinguish initial loading, unauthenticated, forbidden, network/API error, and successful account states.
- Associate field errors with form inputs, expose submit progress, preserve keyboard focus, and use visible focus styles.
- Use semantic navigation, headings, buttons, and links; provide accessible labels for icon-only controls and an announced status region for async feedback.
- Status meaning is expressed with text as well as color. Mobile navigation targets remain at least 44 px high.

## Out of scope for this slice

- Community and UMKM registration persistence and identity-document uploads.
- UMKM profiles and verification statuses, food listing CRUD, discovery filters, claims, quota rules, cancellations, and pickup confirmation.
- Admin approval/rejection actions, reports/moderation, audit log, exports, user management, and impact statistics.
- Resolving the PRD's open decisions about phone/email identifiers, claim quantity, cancellation, handover confirmation, purpose taxonomy, and metric definitions.

## Validation

- Laravel feature coverage for successful/failed login, authenticated identity, logout, role access, and forbidden access.
- Web production build and lint.
- Manual route review at narrow mobile, tablet, and desktop widths, including loading, signed-out, wrong-role, and API-unavailable states.

## Trade-off

This slice delivers secure role-aware dashboard entry points without pretending that the larger operational workflows already exist. The visible overview remains intentionally light until the domain endpoints and unresolved product rules are implemented in subsequent vertical slices.
