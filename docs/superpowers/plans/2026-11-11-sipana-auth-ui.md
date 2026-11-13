# SIPANA Auth UI Implementation Plan

> **For agentic workers:** Follow this plan task by task in the current workspace.

**Goal:** Implement FigCraft-aligned login, community registration, and UMKM registration screens with client-side validation.

**Architecture:** Keep the three pages separate and share a small auth shell and field primitives. Register explicit pathname routes in the existing `App.jsx`; forms validate locally and provide honest UI feedback without making API requests.

**Tech Stack:** React 19, Vite, Tailwind CSS 4, existing SIPANA assets and design tokens.

---

### Task 1: Shared authentication layout

**Files:**
- Create: `apps/web/src/components/auth-layout.jsx`

- [x] Add the SIPANA logo, canvas background, responsive content container, top links, labeled field, and form status primitives.
- [x] Match colors and typography to the `00 — Design system & components` frame and preserve visible keyboard focus.

### Task 2: Login and community registration

**Files:**
- Modify: `apps/web/src/pages/feat-login/login.jsx`
- Modify: `apps/web/src/pages/feat-login/registUser.jsx`

- [x] Implement login identifier/password fields, password visibility, local required-field checks, and links to both registration types.
- [x] Implement member name, WhatsApp, district, password, and terms consent fields with inline validation.
- [x] Keep successful local validation distinct from an account being created or an authenticated session.

### Task 3: UMKM registration

**Files:**
- Modify: `apps/web/src/pages/feat-login/registUmkm.jsx`

- [x] Implement owner/contact/business/type/district/address fields and local image/document selection controls.
- [x] Validate required values and selected uploads locally; show selected file names and recoverable field errors.
- [x] Continue to a second local UI step for account password and confirmation.

### Task 4: Route integration and responsive review

**Files:**
- Modify: `apps/web/src/App.jsx`
- Modify: `apps/web/src/components/nav.jsx`

- [x] Route `/login`, `/regist-user`, and `/regist-umkm` to their pages and connect the public navigation's Masuk button.
- [x] Build the web app and run lint.
- [ ] Visually inspect each route at desktop and narrow viewport widths; correct issues found. Browser preview service was unavailable in this session.
