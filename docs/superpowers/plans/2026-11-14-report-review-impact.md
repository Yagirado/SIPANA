# Implementation Plan: Report Review and UMKM Impact

## Goal

Implement the approved report workflow end to end: reports are routed to the correct subject, reviewed by admins, answered by the subject, decided with proportionate actions, and appealable once within seven calendar days. Reports alone must not penalize accounts, listings, or historical impact.

## Work sequence

1. **Persist case state and event history**
   - Extend `reports` with the server-derived subject, safe subject-facing summary, response deadline, decision fields, appeal deadline, and any emergency hold metadata.
   - Add a chronological report event table with visibility (`admin_only`, `reporter_summary`, `subject_visible`) for admin notes, status changes, responses, decisions, and appeals.
   - Add moderation fields separate from transaction and verification state on listings and users.
   - Backfill existing reports only where the subject can be inferred safely; ambiguous cases remain open for manual triage.
   - Files: migrations, `Report`, new `ReportEvent`, `Listing`, and `User` models.

2. **Route reports to the right person and enforce visibility**
   - Derive subjects from the listing owner or the other participant in a claim; never accept subject IDs from the client.
   - Add authorized case listing/detail, response, and appeal endpoints for reporters and subjects.
   - Keep raw report text and reporter identity admin-only; expose only the sanitized summary, decision summary, and subject's own submissions to the subject.
   - Files: community and UMKM controllers/requests, API routes, shared report resource/authorization logic.

3. **Implement admin triage, decisions, and audit trail**
   - Add admin endpoints for taking a case, requesting a subject response with a deadline, recording a reasoned outcome, urgent listing-only hold/release, and appeal resolution.
   - Enforce valid state transitions and response deadline before ordinary action. Permit a no-action outcome without any moderation effect.
   - Restrict account only for severe/repeated substantiated violations; do not count raw reports or no-action outcomes.
   - Write each transition and moderation effect transactionally with an audit event.
   - Files: `AdminController` or focused moderation controller, requests, routes, audit integration.

4. **Apply moderation without damaging transactions or impact history**
   - Exclude temporarily hidden/removed listings from public discovery while retaining their records and completed claim history.
   - Block restricted UMKM from creating/publishing new listings while preserving sign-in, case response, appeal, and existing claim handling.
   - Keep moderation state separate from verification and listing transaction statuses; preserve completed handovers and impact calculations.
   - Files: public listing queries/resources, listing write authorization, relevant model scopes/policies.

5. **Complete the dashboard workflow**
   - Admin: queue and detail with triage, response deadline, decision/action, urgent hold, and appeal review.
   - Reporter: show case progress and a safe final summary.
   - Subject (community or UMKM): show safe allegations, submit a response, see the decision, and appeal during the seven-day window.
   - Files: admin, community, and UMKM dashboard pages plus API client/types as needed.

6. **Review implementation and verify safely**
   - Check migration/model/controller/frontend consistency and run formatting/lint/build or PHP syntax checks for touched code.
   - Do not run migrations or alter local data automatically. Report the migration command for the user to run after reviewing environment configuration.

## Acceptance checks

- Correct subject is assigned server-side for both report sources; ambiguous legacy cases receive no automatic sanction.
- Admin, reporter, and subject receive only data permitted for their role.
- Ordinary action requires a response or expired admin-set deadline; emergency hold affects only one listing and is reviewable.
- A single appeal is accepted for seven calendar days; appeal outcome and prior decision remain in case history.
- Public discovery hides moderated listings, while completed claims and historical impact remain intact.
- Restricted UMKM can access their case and existing claims but cannot create/publish new listings.
- No automatic action or impact change occurs from a new report.
