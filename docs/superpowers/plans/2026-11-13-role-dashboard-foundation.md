# SIPANA Role Dashboard Foundation Implementation Plan

> **For agentic workers:** Use this plan task-by-task in the current workspace.

**Goal:** Add secure role-aware session access and responsive, data-honest overview dashboards for admin, UMKM, and community users.

**Architecture:** Laravel Sanctum owns authentication and server-enforced roles. The React app uses one credentialed API client and auth provider, then renders role-specific routes inside a shared dashboard shell. The first slice contains account identity only; domain-specific metrics remain explicitly unavailable until real endpoints are built.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, React Router 8, Laravel 13, Laravel Sanctum 4, PHPUnit 12.

---

### Task 1: Role schema and authorization middleware

**Files:**
- Create: `apps/api/database/migrations/2026_11_13_000001_add_role_to_users_table.php`
- Create: `apps/api/app/Http/Middleware/EnsureUserHasRole.php`
- Modify: `apps/api/app/Models/User.php`
- Modify: `apps/api/bootstrap/app.php`

- [x] Add a non-null `role` string defaulting existing rows to `community`; cast it through a role constant or enum and add a `hasRole` helper.
- [x] Add middleware requiring one of the explicit allowed roles; return JSON 403 for authenticated role mismatch.
- [x] Register a `role` alias in Laravel bootstrap; never accept role assignment from public input.

### Task 2: Stateful session API

**Files:**
- Create: `apps/api/app/Http/Controllers/Api/AuthController.php`
- Create: `apps/api/app/Http/Requests/Api/LoginRequest.php`
- Modify: `apps/api/routes/api.php`
- Modify: `apps/api/bootstrap/app.php`
- Modify: `apps/api/config/sanctum.php`
- Modify: `apps/api/.env.example`
- Modify: `apps/web/vite.config.js`

- [x] Enable Sanctum's stateful API middleware and configure local Vite stateful domains.
- [x] Implement login by the existing canonical schema field `email`, current-user response, and logout/session invalidation.
- [x] Add role-protected overview endpoints for `/api/admin/dashboard`, `/api/umkm/dashboard`, and `/api/community/dashboard`; each returns only the current account identity and role.
- [x] Proxy `/api` and `/sanctum` through Vite during development so browser cookies remain first-party.

### Task 3: Laravel feature coverage

**Files:**
- Create: `apps/api/tests/Feature/Api/AuthenticationTest.php`
- Create: `apps/api/tests/Feature/Api/RoleDashboardTest.php`

- [x] Cover valid and invalid email/password login, current-user access, and session logout.
- [x] Cover each role's permitted dashboard endpoint, 401 for guests, and 403 for another role.
- [x] Use the in-memory SQLite configuration already defined in `phpunit.xml`.

### Task 4: Web API client and session state

**Files:**
- Create: `apps/web/src/lib/api.js`
- Create: `apps/web/src/auth/auth-context.jsx`
- Create: `apps/web/src/auth/protected-route.jsx`
- Modify: `apps/web/src/main.jsx`
- Modify: `apps/web/src/pages/login/login.jsx`

- [x] Add a credentialed fetch client that initializes CSRF, reads Laravel's XSRF cookie, parses JSON, and maps 401/403/network failures distinctly.
- [x] Load the current user once in an auth provider; expose `user`, `status`, `login`, and `logout`.
- [x] Replace local-only login success messaging with real email/password submission, progress, generic credential error, and role-directed redirect.
- [x] Preserve the registration screens' honest local-only behavior and avoid claiming that an account was persisted.

### Task 5: Shared role-aware dashboard shell

**Files:**
- Create: `apps/web/src/components/dashboard/dashboard-layout.jsx`
- Create: `apps/web/src/components/dashboard/dashboard-sidebar.jsx`
- Create: `apps/web/src/components/dashboard/dashboard-mobile-nav.jsx`
- Create: `apps/web/src/components/dashboard/dashboard-page-header.jsx`
- Create: `apps/web/src/components/dashboard/dashboard-state.jsx`
- Create: `apps/web/src/config/dashboard-navigation.js`

- [x] Define role-specific menu labels for the first slice: community (Ringkasan warga), UMKM (Ringkasan usaha), admin (Ringkasan admin). Keep only implemented destinations in navigation; do not show dead links to later workflows.
- [x] Build desktop sidebar and top bar using the SIPANA tokens and horizontal logo on light surfaces.
- [x] At mobile widths use bottom navigation for community and UMKM and an accessible menu drawer for admin.
- [x] Add consistent loading, error/retry, empty/unavailable, and access-denied states; ensure icon controls have labels and keyboard support.

### Task 6: Role-specific dashboard overview routes

**Files:**
- Create: `apps/web/src/pages/dashboard/community-dashboard.jsx`
- Create: `apps/web/src/pages/dashboard/umkm-dashboard.jsx`
- Create: `apps/web/src/pages/dashboard/admin-dashboard.jsx`
- Modify: `apps/web/src/App.jsx`

- [x] Add protected role routes and a safe `/dashboard` redirect based only on the authenticated user role.
- [x] Add a community welcome panel and honest explanations that discovery and claims are not connected yet; show no fake listings or counts.
- [x] Add an UMKM account panel and explain that verification, posting, listings, and claims are not connected yet; do not render dead action buttons.
- [x] Add an admin account panel and explain that queues, moderation, reports, charts, and operational metrics are not connected yet; show no fake data.
- [x] Keep login/public/legal routes working and fix imports to the existing `pages/login/*` files.

### Task 7: Validation and responsive review

**Files:**
- Review: `apps/web/src/pages/dashboard/*`
- Review: `apps/web/src/components/dashboard/*`

- [x] Run the requested PHP feature tests, web lint, and web production build.
- [ ] Inspect the app at 360 px, tablet, and desktop widths; check sidebar/mobile navigation, long names, unavailable data, focus visibility, and absence of horizontal overflow.
- [ ] Correct issues found and record any behavior that remains unavailable because its API/domain slice is not implemented.
