---
title: "Surplus Food Distribution Platform"
date: "November 7, 2026"
mode: "fast"
version: 1
---

# Executive Summary

# 1. Executive Summary

**SIPANA** (Sistem Informasi Pangan Berlebih) is a web-based platform that connects verified culinary MSMEs (UMKM kuliner) in Karawang Regency with the general public, enabling the structured, free distribution of surplus food that is still safe to consume before its pickup deadline expires. Today, surplus handling is informal and unstructured: MSMEs give leftovers to neighbors or employees, or simply discard them, while the wider community has no reliable channel to discover and safely claim available food. SIPANA replaces this ad-hoc practice with a transparent, safety-first marketplace of surplus food listings.

The product's core value proposition is **food safety as the organizing principle**, not an afterthought. Every listing is tied to a verified MSME, carries a recorded cooking time, a usage-designation label (personal consumption, redistribution to those in need, or animal feed), a "report" button, and acceptance of terms and conditions. Claim quotas and a two-party handover confirmation ensure that food reaches a real recipient and that distribution is traceable. This safety-first design directly addresses the single largest barrier identified in our survey: 55% of MSMEs (6 of 11) feared being held liable if a recipient fell ill.

The initial launch targets Karawang Regency, with a pilot in the three districts from which survey respondents originated: Karawang Barat, Telukjambe Timur, and Karawang Timur. The expected business impact is twofold: reducing edible food waste among small food businesses and improving food access for lower-income residents, while generating a measurable record of social impact (portions distributed, MSMEs onboarded, meals redirected from waste). Out of scope for v1 are monetary donations, payments, food delivery logistics, a mobile app, and any region outside Karawang.

---
---

# 2. Problem Statement

**Who experiences this problem.** Two groups experience the problem in complementary ways. First, **culinary MSMEs in Karawang** generate surplus food regularly but have no structured outlet for it. Survey data shows 82% (9 of 11) of responding MSMEs have unsold goods at least 2–3 times per week, and 91% (10 of 11) have daily leftovers — all under 10 portions, with 82% being cakes, bread, and snacks. Second, **the general public in Karawang** — particularly factory and industrial-area workers (6 of 14 respondents), other employees, self-employed residents, and homemakers — lacks any reliable way to learn about available surplus food. 64% (9 of 14) have seen still-edible food thrown away, yet 64% (9 of 14) have never obtained free or discounted food from MSME surplus.

**How they currently cope.** MSMEs handle surplus informally: 91% (10 of 11) distribute it informally — 7 give it to people in need, 3 share it with neighbors or employees, and 1 freezes it. Not a single respondent reported discarding surplus, which indicates strong latent goodwill but also reveals that distribution is unstructured, limited to personal networks, and untracked. The public, meanwhile, has no discovery mechanism and must rely on chance encounters or word of mouth.

**Cost and impact of the unsolved problem.** The unsolved problem produces three costs. (1) *Lost social value*: edible food that could feed people in need stays within a business owner's immediate circle or goes unconsumed. (2) *Liability anxiety that suppresses giving*: 55% of MSMEs (6 of 11) cite fear of being sued if a recipient gets sick, and 27% (3 of 11) worry about reputational damage — barriers that a structured, safety-documented platform can materially reduce. (3) *Friction and inconvenience*: 27% (3 of 11) find managing distribution a hassle, and 64% (7 of 11) say their willingness to use a platform depends on how easy it is. The status quo therefore wastes food, limits community benefit, and leaves MSMEs without the confidence or tools to distribute at scale.

**Why now.** Three conditions make this the right moment. First, demand signals are strong and non-rejecting: 0 of 11 MSMEs refused to use SIPANA, and 73% (8 of 11) rated willingness to give free food at 4–5 on a 5-point scale. Second, the most-requested features map directly to a lightweight web build — fast posting (64%), handover confirmation (45%), usage-designation selection (45%), and verified recipients (45%) — meaning a focused v1 can address the top needs. Third, the pilot geography is well-defined (three districts) and the technology stack is standard web tooling, enabling a scoped, testable launch before November. The window is now to convert informal goodwill into a safe, measurable, and scalable distribution channel.

---
---

# 3. Goals & Objectives

The following SMART goals define what SIPANA must achieve. Each is Specific, Measurable, Achievable, Relevant, and Time-bound, with an explicit success threshold. These goals anchor the success metrics detailed in Section 12.

| ID | Goal (SMART) | Success Metric | Target Threshold | Timeframe |
|---|---|---|---|---|
| **G1** | Onboard verified culinary MSMEs in the three pilot districts (Karawang Barat, Telukjambe Timur, Karawang Timur) so the platform has a reliable supply of surplus-food listings. | Number of MSME accounts that complete verification and publish at least one listing | ≥ 10 verified MSMEs publishing ≥ 1 listing each | Within 8 weeks of pilot launch |
| **G2** | Enable the public to discover and claim surplus food, converting listings into confirmed handovers. | Claim-to-handover conversion rate (confirmed handovers ÷ total claims) | ≥ 70% of claims result in a confirmed handover | Within 8 weeks of pilot launch |
| **G3** | Reduce edible food waste by redirecting surplus portions from informal/discarded channels to documented distribution. | Total portions distributed and recorded through SIPANA | ≥ 300 portions distributed via confirmed handovers | Within 8 weeks of pilot launch |
| **G4** | Establish food-safety trust by making every listing traceable and every recipient able to report issues. | Share of active listings with complete required safety fields (cooking time, usage designation, T&C acceptance) and median report-response time | 100% of active listings complete; 100% of reports acknowledged within 24 hours | Continuous; measured at 8 weeks |
| **G5** | Validate product usability and adoption to justify continuation beyond the pilot. | Post-pilot satisfaction (MSMEs and recipients) and listing-posting completion rate | ≥ 80% of surveyed users rate ease-of-use ≥ 4/5; ≥ 90% of started listings successfully published | Measured at end of 8-week pilot |

**Primary vs. secondary goals.** G1, G2, and G3 are primary — they prove the core distribution loop works (supply → discovery → handover → recorded impact). G4 and G5 are secondary but essential: G4 protects the safety-first value proposition that differentiates SIPANA (addressing the 55% liability fear), and G5 validates that the "fast posting" requirement (the top-requested feature at 64%) is genuinely met before scaling.

**Expected outcomes.** At the end of the pilot, SIPANA should demonstrate a functioning, safety-documented distribution loop in three districts, a measurable record of portions redirected from waste, and evidence that MSMEs and the public will adopt the platform — the foundation required to justify expansion to additional Karawang districts and, later, beyond the regency.

> **Methodology caveat:** Goals and thresholds are calibrated against a small, non-probability survey sample (n=25) and should be treated as pilot targets to be re-baselined after the first 8 weeks of real usage data, not as validated market forecasts.

# Problem Statement

## 2. Problem Statement

### 2.1 Background

Karawang Regency is one of Indonesia's most industrialized regencies, hosting thousands of manufacturing and logistics establishments. This economic profile has produced a dense and competitive culinary sector. Small and medium food businesses (UMKM kuliner) — warung makan, katering, kafe, toko kue, and rumahan producers — operate in every kecamatan, from Karawang Barat and Karawang Timur to Klari, Cikampek, and Rengasdengklok. These businesses compete for a daily customer base that is increasingly price-sensitive and time-constrained.

At the same time, a persistent operational reality affects the sector: **predictable daily surplus**. Culinary businesses must prepare stock before they know actual demand. Rice, side dishes, pastries, and packaged goods are frequently left unsold at the end of the operating day. Because most UMKM lack cold-chain storage, formal redistribution partnerships, or a structured channel to dispose of surplus, unsold food is typically discarded — a total loss for the business and a waste stream for the community.

SIPANA (Sistem Informasi Pangan Berlebih) is conceived as the platform that closes this gap. This section defines the problem the platform addresses, who experiences it, how those parties cope today, what the unsolved problem costs, and why the time to act is now.

### 2.2 Core Problem Statement

> **Verified culinary MSMEs in Karawang Regency generate predictable daily food surplus that is discarded because no structured, trustworthy, and low-friction channel exists to redistribute it to the general public at a reduced price. Simultaneously, price-sensitive residents lack a reliable way to discover and purchase affordable prepared food from businesses they can trust. The result is economic loss for MSMEs, food waste for the community, and lost purchasing power for consumers.**

The problem has three interlocking faces:

1. **Supply-side loss.** MSMEs absorb the full cost of unsold food with no recovery mechanism.
2. **Demand-side gap.** Consumers who would willingly buy surplus food at a discount have no way to find it, verify its quality, or transact safely.
3. **Trust deficit.** Neither side has a mechanism to confirm that the counterparty is legitimate — that the business is a real, verified MSME, and that the food offered is safe and accurately described.

### 2.3 Who Experiences the Problem

| Affected Party | Role in the Problem | Nature of the Pain |
|---|---|---|
| **UMKM kuliner owners and operators** (warung, katering, kafe, toko kue, rumahan producers) | Generate the surplus; must decide daily what to do with unsold stock | Direct financial loss; no recovery channel; disposal consumes time and effort; reputational discomfort at discarding food |
| **General public / end consumers** in Karawang (students, workers, families, budget-conscious households) | Would purchase affordable prepared food if discoverable and trustworthy | No aggregated discovery channel; cannot verify seller legitimacy; risk of stale or misrepresented food; reliance on informal word-of-mouth |
| **The wider Karawang community** | Bears the environmental and social cost of food waste | Food waste stream; lost opportunity to convert surplus into affordable nutrition for residents |

The platform's primary actors — **MSMEs** and the **general public** — are the two sides whose needs must be simultaneously satisfied for the product to function. This dual-sided dynamic is central to the product vision described in Section 1 (Executive Summary) and will drive the persona definitions in Section 4.

### 2.4 How Affected Parties Cope Today

**MSMEs currently cope through informal, ad-hoc measures:**

- **Discarding unsold food** at end of day — the default outcome, representing a 100% loss on the affected inventory.
- **Last-minute price slashing** at the physical stall, which recovers some cost but erodes margin and can undercut the business's regular pricing.
- **Giving surplus away** to staff, family, or neighbors — socially positive but financially unrecoverable and unscalable.
- **Reducing production below demand** — a defensive response that protects against waste but caps revenue and risks stockouts during peak periods.
- **Informal WhatsApp or social-media posts** offering discounts — reach is limited to existing contacts, offers are unstructured, and there is no verification or transaction record.

**Consumers currently cope by:**

- Relying on **word-of-mouth and physical proximity** — they can only buy surplus from businesses they already pass or know.
- **Monitoring social media** for informal discount announcements — unreliable, unstructured, and impossible to search systematically.
- **Accepting full price** even when they would have purchased surplus at a discount, because they cannot discover it in time.

The common thread: **every current workaround is informal, unscalable, and built on personal networks rather than a structured marketplace.** No party has a dedicated tool designed for the surplus-food use case.

### 2.5 Cost and Impact of the Unsolved Problem

The unsolved problem imposes measurable costs across three dimensions:

**Economic cost to MSMEs.** Every discarded portion is a direct write-off of ingredient cost, preparation labor, and packaging. For a business operating on thin culinary margins, daily surplus compounds into a recurring, predictable revenue leak. Because the loss is invisible in day-to-day operations — it appears simply as "food we didn't sell" — it is rarely quantified, which makes it harder to address.

**Cost to consumers.** Price-sensitive residents — students, daily wage workers, and large households — pay full price for prepared food or forgo it entirely. The absence of a discounted surplus channel removes a legitimate avenue for stretching household budgets, particularly relevant in a regency with a large industrial workforce on fixed incomes.

**Environmental and social cost.** Discarded prepared food becomes waste. In a community context, discarding edible food while residents face food-cost pressure represents a dual inefficiency: waste on one side, unmet affordable-nutrition demand on the other.

**Trust and transaction cost.** Even where both parties would benefit from a surplus transaction, the absence of a verification mechanism means each side must absorb the risk of dealing with an unverified counterparty. This friction suppresses transactions that would otherwise occur.

> **Note on quantification:** The source material establishes the *existence and mechanism* of these costs but does not provide baseline measurements (e.g., kilograms of daily surplus per business, rupiah value of monthly write-offs, number of affected MSMEs). Establishing these baselines is a prerequisite for the KPIs defined in Section 12 and should be treated as a launch-phase measurement task. Specific figures are marked **TBD** pending baseline data collection.

### 2.6 Why Now

Four converging conditions make this the right moment to solve the problem:

1. **Digital readiness of MSMEs.** Culinary MSMEs in Karawang increasingly operate with smartphones and basic digital literacy, making a web-based listing and ordering workflow feasible without requiring new hardware or deep technical skill. SIPANA is designed as a web platform precisely to meet businesses where they already are.

2. **Consumer expectation of digital discovery.** Residents routinely use digital channels to find food and services. A structured, searchable platform meets an existing behavior rather than requiring a new one.

3. **Verification as a differentiator.** Informal WhatsApp and social-media selling already exists, but it lacks the one thing that unlocks trust: **verified seller status**. SIPANA's verification model addresses the trust deficit that informal channels cannot.

4. **Low-cost, high-leverage intervention.** The surplus already exists; the food is already prepared. The platform does not require MSMEs to change what they produce — only to route existing surplus through a structured channel. This makes the intervention economically efficient: it monetizes an asset that is currently written off entirely.

### 2.7 Proposed Solution (Problem–Solution Mapping)

SIPANA addresses each face of the problem directly:

| Problem | SIPANA Response |
|---|---|
| MSMEs discard surplus with no recovery channel | A structured listing workflow lets verified MSMEs publish surplus food with reduced pricing, converting a write-off into recovered revenue |
| Consumers cannot discover affordable surplus food | A public, searchable catalog aggregates surplus listings from verified businesses across Karawang |
| Neither side can verify the counterparty | A seller verification process confirms MSME legitimacy before listings go live, establishing the trust baseline that informal channels lack |
| Transactions are informal and untracked | A structured ordering flow creates a record of each surplus transaction for both parties |

This mapping defines the functional scope detailed in Section 6 and the user stories in Section 5. The solution is deliberately scoped to the surplus-redistribution use case; adjacent opportunities (e.g., delivery logistics, payment escrow, cold-chain support) are addressed in the scope boundaries of Section 5 and the out-of-scope determinations of the functional requirements.

### 2.8 Problem Statement Summary

The problem SIPANA solves is **the absence of a structured, trustworthy channel for redistributing culinary surplus in Karawang Regency.** MSMEs lose money on food they cannot sell; consumers cannot find affordable food they would gladly buy; and both sides lack the verification needed to transact with confidence. Current coping mechanisms are informal, unscalable, and trust-poor. The surplus already exists and the digital readiness already exists — what is missing is the platform that connects them. SIPANA is that platform.

# Goals & Objectives

## 3. Goals & Objectives

The goals below translate the vision set out in the Executive Summary and the challenges documented in the Problem Statement into measurable, time-bound commitments. All targets are defined relative to the public launch date of SIPANA, referred to as **L0** (Launch Day). Pre-launch milestones are expressed relative to **T-30** (30 days before launch). Targets assume the Karawang Regency initial deployment described in the Problem Statement; district-level expansion is out of scope for this goal cycle.

### 3.1 Primary Goals (SMART)

#### G1 — Onboard a Verified MSME Supply Base

| Attribute | Definition |
|---|---|
| **Specific** | Recruit and verify culinary MSMEs (UMKM kuliner) in Karawang Regency as registered surplus-food donors, including business legality verification and food-handling eligibility checks. |
| **Measurable** | Number of MSME accounts that have completed verification (business identity + food-safety attestation) and published at least one surplus listing. |
| **Achievable** | Achievable through a targeted field-recruitment campaign coordinated with local trade and MSME offices; the density of culinary MSMEs in Karawang (per the Problem Statement) supports this volume. |
| **Relevant** | Directly addresses the supply-side fragmentation identified in the Problem Statement — without verified donors, no surplus can be redistributed. |
| **Time-bound** | 100 verified MSMEs by L0; 400 verified MSMEs by L0 + 6 months. |

**Success metric:** ≥100 verified MSME accounts at launch; ≥400 at L0 + 6 months.
**Target threshold:** ≥80% of verified MSMEs publish at least one surplus listing within 14 days of account approval.

#### G2 — Convert Surplus Food into Completed Redistributions

| Attribute | Definition |
|---|---|
| **Specific** | Enable the structured, free redistribution of surplus food from verified MSMEs to the general public through the platform's listing and claim workflow. |
| **Measurable** | Total weight (kg) of surplus food recorded as successfully redistributed (listing claimed, picked up, and confirmed by both parties) per month. |
| **Achievable** | Derived from expected listing volume (G1) × average portion weight × completion rate; calibrated conservatively against comparable food-rescue pilots. |
| **Relevant** | This is the core value proposition of SIPANA — reducing edible food waste while widening affordable food access. |
| **Time-bound** | 500 kg redistributed in the first full month post-launch; 3,000 kg/month by L0 + 6 months. |

**Success metric:** Monthly redistributed weight (kg) and count of completed redistributions.
**Target threshold:** ≥70% of published listings reach "completed" status (claimed, collected, and confirmed) rather than expiring unclaimed.

#### G3 — Grow an Active Public Demand Base

| Attribute | Definition |
|---|---|
| **Specific** | Acquire and retain general-public users in Karawang Regency who actively browse and claim surplus listings. |
| **Measurable** | Monthly Active Users (MAU) and claim-conversion rate (claims ÷ listing views). |
| **Achievable** | Supported by free-of-charge listings (a core differentiator noted in the Executive Summary) and local community outreach. |
| **Relevant** | Demand-side liquidity is required for donors to see their surplus consistently collected; without it, supply-side retention collapses. |
| **Time-bound** | 1,000 registered public users and 300 MAU by L0 + 3 months; 5,000 registered users and 1,500 MAU by L0 + 6 months. |

**Success metric:** Registered public users; MAU; claim-conversion rate.
**Target threshold:** Claim-conversion rate ≥15% of listing detail views; 30-day public-user retention ≥25%.

#### G4 — Deliver a Reliable, Trusted Platform Experience

| Attribute | Definition |
|---|---|
| **Specific** | Operate SIPANA at a reliability and trust level sufficient for daily reliance by MSMEs and the public, including verification integrity and food-safety information disclosure. |
| **Measurable** | Platform uptime during business hours, median page load time, and share of listings displaying complete food-safety metadata (allergens, preparation time, expiry window). |
| **Achievable** | Achievable with standard web-hosting SLAs and mandatory metadata fields enforced at listing creation. |
| **Relevant** | Trust is the principal adoption barrier for free food redistribution; verification and transparency are prerequisites (see Problem Statement). |
| **Time-bound** | Sustained from L0 through L0 + 6 months. |

**Success metric:** Uptime ≥99.5% (06:00–22:00 WIB); median page load ≤3 s on 4G; ≥95% of live listings carry complete food-safety metadata.
**Target threshold:** Zero unresolved food-safety incidents attributable to missing platform disclosures per quarter.

### 3.2 Secondary Goals

| ID | Goal | Success Metric | Target | Timeframe |
|---|---|---|---|---|
| G5 | Establish operational reporting for stakeholders (regency offices, MSME associations) | Automated monthly impact report generated and delivered | 100% of months post-launch | L0 + 1 month onward |
| G6 | Achieve cost-efficient donor acquisition | Cost per verified MSME | ≤ IDR 50,000 | L0 + 6 months |
| G7 | Build a reusable verification workflow for future district expansion | Verification turnaround time (submission → decision) | Median ≤48 hours | L0 + 3 months |

### 3.3 Expected Outcomes

By L0 + 6 months, SIPANA is expected to have produced the following outcomes, each traceable to the goals above:

1. **A functioning local food-rescue network** — at least 400 verified MSME donors and 5,000 public users transacting through a single structured channel (G1, G3).
2. **Measurable waste reduction** — cumulative ≥15,000 kg of surplus food redistributed rather than discarded (G2).
3. **A trusted, transparent marketplace** — verification integrity and food-safety disclosure sustained with zero unresolved disclosure-related incidents (G4).
4. **An evidence base for scale-up** — monthly impact reports providing the data required to justify expansion beyond Karawang Regency (G5).

### 3.4 Goal Traceability

| Goal | Addresses Problem Statement Theme | Primary Stakeholder Beneficiary |
|---|---|---|
| G1 | Supply-side fragmentation; unverified donors | MSMEs |
| G2 | Edible surplus discarded; access gap | MSMEs and public |
| G3 | Low public awareness and access | General public |
| G4 | Trust and food-safety concerns | All users |
| G5–G7 | Operational sustainability | Platform operators, regency stakeholders |

> **Note:** All numeric targets above are planning commitments for this goal cycle and should be validated against baseline field data collected during the T-30 recruitment pilot. Any revision must be recorded in the Appendix with rationale.

# Target Audience

# 4. Target Audience

SIPANA serves two distinct user populations whose needs are structurally asymmetric: culinary MSMEs (UMKM) supply surplus food, while the general public consumes it. Both groups must be designed for independently — the platform's viability depends on supply-side reliability (UMKM post listings consistently) and demand-side trust (the public feels safe claiming food). The personas below are grounded in the survey data documented in the Problem Statement and Goals & Objectives sections (n=25: 11 UMKM, 14 community respondents, exported 19 October 2026).

> **Methodology caveat (carried forward):** The survey sample is small and non-probability-based (distributed through group networks). Personas represent directional archetypes derived from observed response clusters, not statistically representative segments. They should be validated during the Karawang Barat / Telukjambe Timur / Karawang Timur pilot.

## 4.1 Persona Overview

| ID | Persona | Type | Segment | Survey Basis |
|---|---|---|---|---|
| P1 | Ibu Wati — Pemilik Toko Kue Rumahan | **Primary** | UMKM (supply side) | 9/11 UMKM respondents sell kue/roti/jajanan; 82% have surplus ≥2–3×/week |
| P2 | Pak Dedi — Pekerja Pabrik Kawasan Industri | **Primary** | Masyarakat (demand side) | 6/14 community respondents are factory/industrial workers |
| P3 | Bu Rina — Kader PKK / Penggerak Lingkungan | **Secondary** | Masyarakat (demand side, redistributor) | Community respondents include 2 ibu rumah tangga; platform explicitly permits re-distribution to those in need |
| P4 | Admin SIPANA — Operator Verifikasi & Moderasi | **Secondary** | Internal operations | Verification, reporting, and moderation requirements defined in system design |

**Primary personas (P1, P2)** are the two sides of the core transaction loop. If either fails to adopt, the marketplace has no liquidity. All P0 requirements trace to these two personas.

**Secondary personas (P3, P4)** extend reach (P3 multiplies each claim's impact through redistribution) or sustain trust and safety (P4). Their requirements are largely P1 priority.

---

## 4.2 P1 — Ibu Wati, Pemilik Toko Kue Rumahan *(Primary — Supply Side)*

| Attribute | Detail |
|---|---|
| **Demographics** | Female, 38–50 years old, lives and operates in Karawang Barat; household-based business |
| **Role/Title** | Owner-operator, home-based kue/roti/jajanan shop (usaha >5 years) |
| **Business profile** | Produces cakes, breads, and snacks daily; typical daily surplus of **1–5 portions** (91% of UMKM respondents report surplus under 10 portions); surplus becomes certain **before 15:00** on 73% of days |
| **Tech proficiency** | **Low-to-moderate.** Comfortable with WhatsApp and Facebook; uses a smartphone as primary device; has never used a food-rescue or marketplace-backoffice tool. Survey free-text repeatedly requested WhatsApp linkage and "easy to use" ("website nya mudah di pakai") |
| **Current workflow** | At end of day, surplus is given to neighbors, employees, or people nearby (91% informal distribution; **0% report throwing food away**). No record is kept. Timing is ad hoc. |
| **Goals** | (1) Dispose of surplus quickly without it becoming waste; (2) avoid any legal or reputational risk; (3) spend under 2 minutes on the task; (4) feel the surplus went to people who genuinely need it |
| **Pain points** | **55% fear being sued if a recipient gets sick** (top cited concern); 27% worry about brand image; 27% find the process troublesome; distribution reach is limited to people physically nearby; no structured way to signal "available now" to a wider audience |
| **Willingness signals** | 0/11 refused to use SIPANA; 64% said "maybe, depending on ease"; average willingness-to-give-free score 3.64/5 (73% scored 4–5). Fast posting is the #1 requested feature (**64%**), followed by handover confirmation, purpose labeling, and verified recipients (45% each) |
| **Success looks like** | Posts surplus in ≤2 minutes from her phone, gets a confirmed claim before closing time, hands over to a verified recipient, and sees it logged — with zero legal exposure because she attested to food safety at posting |

## 4.3 P2 — Pak Dedi, Pekerja Pabrik Kawasan Industri *(Primary — Demand Side)*

| Attribute | Detail |
|---|---|
| **Demographics** | Male, 25–40 years old, lives in Telukjambe Timur; commutes to an industrial-area factory on shift schedules |
| **Role/Title** | Factory/industrial worker (largest single community segment: 6/14 respondents) |
| **Tech proficiency** | **Moderate.** Daily smartphone user; comfortable with WhatsApp, Google Maps, and basic web forms; expects mobile-responsive layouts even on a "web" product |
| **Current workflow** | Has **never** obtained free/discounted surplus food from UMKM (64% of community respondents have not); discovers cheap food through word of mouth and roadside stalls. Has frequently witnessed edible food being discarded (64% see it often/sometimes) |
| **Goals** | (1) Stretch daily food budget; (2) find available food near home/work **right now**; (3) be confident the food is safe to eat; (4) claim without a complicated signup |
| **Pain points** | No channel exists to learn surplus food is available before it's gone; distrust of unknown food provenance; limited time windows around shift changes; fear of showing up to a listing that is already claimed or withdrawn |
| **Success looks like** | Opens SIPANA, sees a nearby listing with a clear pickup window and purpose label, claims it in a few taps, receives confirmation, and picks it up within the stated window |

## 4.4 P3 — Bu Rina, Kader PKK / Penggerak Lingkungan *(Secondary — Redistributor)*

| Attribute | Detail |
|---|---|
| **Demographics** | Female, 35–55 years old, active in neighborhood women's groups (PKK) or community welfare activity; domiciled in Karawang Barat or Karawang Timur |
| **Role/Title** | Community volunteer / neighborhood coordinator; claims food on behalf of others (elderly neighbors, families in need) |
| **Tech proficiency** | **Low-to-moderate**; WhatsApp-first; may share a device or rely on mobile data |
| **Goals** | (1) Source free food at modest volume for redistribution; (2) ensure recipients receive safe, clearly labeled food; (3) coordinate multiple pickups efficiently |
| **Pain points** | Cannot verify food safety on behalf of others; needs clear purpose labels (e.g., "for consumption" vs. "for animal feed") so she distributes correctly; quota rules must be transparent so she can plan |
| **Success looks like** | Claims within her quota, sees purpose labels on every listing, and redistributes with confidence because the UMKM's safety attestation and cooking time are visible |

> P3 is the mechanism by which SIPANA's stated scope — "may use it themselves, redistribute to those in need, or use as animal feed per the purpose label" — converts single claims into multiplied community impact.

## 4.5 P4 — Admin SIPANA, Operator Verifikasi & Moderasi *(Secondary — Internal)*

| Attribute | Detail |
|---|---|
| **Demographics** | Internal role; student team member or program officer operating the platform during the pilot |
| **Role/Title** | Platform administrator: verifies UMKM registrations, reviews reports, moderates listings, exports impact reports |
| **Tech proficiency** | **High**; comfortable with dashboards, tables, and export tools |
| **Goals** | (1) Keep only legitimate, verified UMKM on the platform; (2) resolve food-safety reports fast; (3) produce the impact recap required for reporting and evaluation |
| **Pain points** | Manual verification is time-consuming; must balance speed (UMKM hate friction) against safety (the platform's core differentiator); needs an audit trail for every verification and moderation decision |
| **Success looks like** | Clears a verification queue within the same day, acts on any report within the defined SLA, and exports a defensible impact report on demand |

## 4.6 Needs → Requirements Traceability

| Persona | Top Need | Where Addressed |
|---|---|---|
| P1 | Post surplus in ≤2 minutes | FR-020 series (fast posting), User Story US-03 |
| P1 | Legal protection from liability | FR-010 (safety attestation), Business Rules (Terms acceptance) |
| P1 | Reach beyond immediate neighborhood | FR-030 (public listing feed) |
| P2 | Find nearby, currently-available food | FR-031 (location filter), FR-032 (pickup window display) |
| P2 | Trust food safety | FR-011 (verification badge), FR-033 (cooking time + purpose label), FR-050 (report button) |
| P2 | Claim without friction | FR-040 series (claim flow), FR-041 (quota enforcement) |
| P3 | Clear purpose labels for redistribution | FR-034 (purpose label: consumption / redistribution / animal feed) |
| P4 | Verification queue + audit trail | FR-012 (admin verification), FR-051 (report handling) |
| P4 | Impact reporting | FR-060 (impact recap & export) |

## 4.7 Anti-Personas (Explicitly Out of Scope)

- **Unverified food businesses** — SIPANA admits only verified UMKM; unverified sellers are rejected at registration (see Functional Requirements, FR-012).
- **Paid buyers / monetary donors** — SIPANA involves no payments or cash donations (see Executive Summary, out-of-scope items).
- **Users outside Karawang Regency** — the pilot is bounded to Karawang Barat, Telukjambe Timur, and Karawang Timur.

# User Stories & Use Cases

# 5. User Stories & Use Cases

Stories are grouped by feature area and prioritized: **P0 (Must-have)** — required for the pilot loop to function; **P1 (Should-have)** — required for trust, safety, and reporting but not blocking the first transaction; **P2 (Nice-to-have)** — valuable enhancements deferrable past the pilot. Every P0 story maps to at least one functional requirement in Section 6.

## 5.1 UMKM Registration & Verification (Supply Onboarding)

| ID | Priority | User Story |
|---|---|---|
| US-01 | **P0** | As an **UMKM owner (P1)**, I want to register my business with my identity and business details, so that I can be verified and start listing surplus food. |
| US-02 | **P0** | As an **UMKM owner (P1)**, I want to accept the terms and conditions that define my food-safety responsibilities, so that I understand my obligations and the platform's liability boundary before I post anything. |
| US-03 | **P1** | As an **UMKM owner (P1)**, I want to see my verification status (pending / verified / rejected with reason), so that I know when I can begin posting. |

## 5.2 Surplus Food Posting (Core Supply Action)

| ID | Priority | User Story |
|---|---|---|
| US-04 | **P0** | As an **UMKM owner (P1)**, I want to post surplus food in under 2 minutes with quantity, food type, cooking time, pickup window, and purpose label, so that it reaches the public before it spoils or my shop closes. |
| US-05 | **P0** | As an **UMKM owner (P1)**, I want to attest that the food is still safe and fit for its labeled purpose when I post, so that I carry clear responsibility for what I offer. |
| US-06 | **P1** | As an **UMKM owner (P1)**, I want to edit or withdraw a listing before it is claimed, so that I stay in control if the food is sold or no longer available. |
| US-07 | **P2** | As an **UMKM owner (P1)**, I want to share my listing to WhatsApp with one tap, so that my regular customers and neighbors see it immediately. |

## 5.3 Browsing & Discovery (Demand Side)

| ID | Priority | User Story |
|---|---|---|
| US-08 | **P0** | As a **community member (P2)**, I want to browse currently available surplus food near me with pickup windows and purpose labels, so that I can find something I can actually collect in time. |
| US-09 | **P1** | As a **community member (P2)**, I want to see the UMKM's verification badge, cooking time, and food type on each listing, so that I can judge whether the food is safe for me. |
| US-10 | **P2** | As a **community member (P2)**, I want to filter listings by district and purpose (consumption vs. animal feed), so that I only see listings relevant to my needs. |

## 5.4 Claiming & Handover (Core Transaction Loop)

| ID | Priority | User Story |
|---|---|---|
| US-11 | **P0** | As a **community member (P2)**, I want to claim a listing within my quota and receive a confirmation, so that I can go pick it up knowing it is reserved for me. |
| US-12 | **P0** | As an **UMKM owner (P1)**, I want to confirm handover when the recipient arrives, so that the transaction is closed and recorded accurately. |
| US-13 | **P1** | As a **community member (P3)**, I want to claim on behalf of others and see the purpose label clearly, so that I can redistribute safely within the rules. |
| US-14 | **P1** | As the **system**, I want to enforce the claim quota and prevent duplicate claims per listing, so that distribution stays fair and listings are not over-promised. |

## 5.5 Trust, Safety & Reporting

| ID | Priority | User Story |
|---|---|---|
| US-15 | **P0** | As a **community member (P2)**, I want to report a listing or a handover problem, so that unsafe or misleading food can be reviewed and removed quickly. |
| US-16 | **P1** | As an **admin (P4)**, I want to review reports and act on listings (warn, suspend, remove), so that the platform maintains food-safety trust. |

## 5.6 Impact & Administration

| ID | Priority | User Story |
|---|---|---|
| US-17 | **P1** | As an **admin (P4)**, I want to export a recap of listings, claims, and handovers, so that I can report measurable impact to stakeholders. |
| US-18 | **P1** | As an **admin (P4)**, I want to verify or reject UMKM registrations with a recorded reason, so that only legitimate businesses join and every decision is auditable. |

---

## 5.7 Primary Use Case — UC-01: Post and Claim Surplus Food (Happy Path)

**Actors:** UMKM owner (P1), Community member (P2), System
**Preconditions:** UMKM is verified and has accepted terms; community member has an account.
**Trigger:** UMKM has surplus food before its stated cutoff time.

| Step | Actor | Action |
|---|---|---|
| 1 | P1 | Opens "Post Surplus" and enters quantity, food type, cooking time, pickup window, and purpose label |
| 2 | P1 | Confirms the food-safety attestation and submits |
| 3 | System | Validates fields, publishes the listing to the public feed, and stamps it with the UMKM's verification badge |
| 4 | P2 | Browses the feed, opens the listing, and taps "Claim" |
| 5 | System | Checks quota and duplicate-claim rules; reserves the listing and issues a claim confirmation to P2 |
| 6 | P2 | Arrives at the UMKM within the pickup window |
| 7 | P1 | Confirms handover in the system |
| 8 | System | Closes the listing, records the handover, and updates the impact recap |

**Postconditions:** Listing marked completed; claim and handover recorded; impact metrics incremented.

## 5.8 Alternative & Error Flows

| ID | Scenario | Flow |
|---|---|---|
| AF-01 | **Listing expires unclaimed** | If the pickup window passes with no confirmed claim, the system auto-expires the listing and removes it from the feed; the UMKM sees it as "expired." |
| AF-02 | **Claimant does not arrive** | If the pickup window closes after a claim without handover confirmation, the claim is marked "no-show"; the listing returns to expired state and the quota rule applies per Business Rules. |
| AF-03 | **UMKM withdraws listing** | Before a claim, the UMKM may withdraw; the listing is removed from the feed and marked "withdrawn." After a claim, withdrawal requires the claim to be cancelled first. |
| AF-04 | **Quota exceeded** | If P2 attempts to claim beyond the allowed quota, the system blocks the claim and shows the quota message. |
| AF-05 | **Duplicate claim on same listing** | If a second user attempts to claim an already-reserved listing, the system prevents it and shows "already claimed." |
| AF-06 | **Unverified UMKM attempts to post** | The system blocks posting and routes the user to verification status. |
| AF-07 | **Food-safety report filed** | P2 files a report; the listing is flagged for admin review per the moderation flow; admin may warn, suspend, or remove. |

## 5.9 Secondary Use Case — UC-02: Verify a UMKM Registration

**Actors:** Admin (P4), UMKM owner (P1)
**Preconditions:** UMKM has submitted registration and accepted terms.
**Main flow:** UMKM submits details → admin reviews identity and business information → admin approves → UMKM status becomes "verified" and posting is enabled → decision and reason are logged.
**Alternative flow:** Admin rejects with a recorded reason → UMKM sees status "rejected" with reason and may resubmit.
**Postconditions:** Verification status updated and auditable; only verified UMKM can post.

## 5.10 Secondary Use Case — UC-03: Report and Moderate a Listing

**Actors:** Community member (P2), Admin (P4)
**Preconditions:** A published listing exists.
**Main flow:** P2 submits a report with a reason → system flags the listing → admin reviews → admin takes action (dismiss, warn, suspend, remove) → reporter and UMKM are notified of the outcome.
**Postconditions:** Moderation decision recorded; listing state reflects the action.

# Functional Requirements

# 6. Functional Requirements

Requirements are grouped by feature area and use the format **FR-XXX**. Each requirement is specific and testable, with acceptance criteria. Priorities follow the same scheme as Section 5: **P0 (Must-have)**, **P1 (Should-have)**, **P2 (Nice-to-have)**. Requirement IDs are the traceability anchor for design, development, and QA.

## 6.1 Account & Registration (FR-001 – FR-009)

**FR-001 — UMKM Registration** *(P0)*
The system shall allow a UMKM to register with identity details (owner name, contact), business details (business name, food type, district), and a password.
**Acceptance criteria:**
- A registration form captures all required fields and validates them (non-empty, valid phone/email format).
- On submit, a UMKM account is created in **pending** status.
- A UMKM in pending status cannot publish listings.

**FR-002 — Community Member Registration** *(P0)*
The system shall allow a community member to register with minimal fields (name, contact, district) and a password.
**Acceptance criteria:**
- Registration completes without requiring business details.
- A newly registered member can browse the feed immediately.
- Duplicate registration on the same contact identifier is rejected with a clear message.

**FR-003 — Authentication & Session** *(P0)*
The system shall authenticate users with credentials and maintain a session.
**Acceptance criteria:**
- Valid credentials grant access to the role-appropriate interface (UMKM vs. community member).
- Invalid credentials are rejected with a generic error (no field-level disclosure of which value was wrong).
- Sessions expire after a defined inactivity period and require re-authentication.

**FR-004 — Role-Based Access Separation** *(P0)*
The system shall enforce distinct interfaces and permissions for UMKM, community members, and admins.
**Acceptance criteria:**
- A community member cannot access UMKM-only actions (post, handover confirm) and vice versa.
- An admin-only area is inaccessible to non-admin roles.
- Unauthorized access attempts are denied and logged.

**FR-005 — Terms & Conditions Acceptance** *(P0)*
The system shall require every UMKM to accept the terms and conditions, including food-safety responsibility, before first posting.
**Acceptance criteria:**
- Posting is blocked until terms are accepted.
- Acceptance is recorded with a timestamp against the UMKM account.
- The accepted terms version is stored for audit.

**FR-006 — Verification Status Visibility** *(P1)*
The system shall display a UMKM's verification status (pending / verified / rejected with reason).
**Acceptance criteria:**
- The status is visible on the UMKM dashboard.
- A rejected UMKM sees the rejection reason and may resubmit.

**FR-007 — Profile Management** *(P2)*
The system shall allow users to update permitted profile fields.
**Acceptance criteria:**
- Editable fields save and persist.
- Changes to fields requiring re-verification (e.g., business identity) return the UMKM to pending status.

## 6.2 UMKM Verification (FR-010 – FR-019)

**FR-010 — Food-Safety Attestation at Posting** *(P0)*
The system shall require the UMKM to attest, at each posting, that the food is safe and fit for its labeled purpose.
**Acceptance criteria:**
- The attestation is a mandatory step before a listing can be published.
- The attestation timestamp is stored with the listing.
- A listing cannot be published without the attestation.

**FR-011 — Verification Badge on Listings** *(P0)*
The system shall display a verification badge on every listing from a verified UMKM.
**Acceptance criteria:**
- Only listings from verified UMKM show the badge.
- The badge is visible on both the feed card and the listing detail view.

**FR-012 — Admin Verification Workflow** *(P0)*
The system shall provide an admin workflow to review UMKM registrations and approve or reject them with a recorded reason.
**Acceptance criteria:**
- Admin sees a queue of pending UMKM.
- Approve sets status to verified and enables posting.
- Reject records a reason and notifies the UMKM.
- Every decision is logged with admin identity and timestamp.

## 6.3 Surplus Food Posting (FR-020 – FR-029)

**FR-020 — Create Listing** *(P0)*
The system shall allow a verified UMKM to create a surplus-food listing capturing: quantity (portions), food type, cooking time, pickup window (start/end), and purpose label.
**Acceptance criteria:**
- All listed fields are mandatory and validated (quantity ≥ 1; pickup end after pickup start; cooking time not in the future).
- A valid submission publishes the listing to the public feed.
- The full flow completes in ≤2 minutes for a returning user (target from survey: 64% ranked fast posting #1).

**FR-021 — Purpose Label** *(P0)*
The system shall require each listing to declare a purpose: **for consumption**, **for redistribution**, or **for animal feed**.
**Acceptance criteria:**
- Exactly one purpose is selected per listing.
- The purpose is displayed prominently on the feed card and detail view.
- The purpose cannot be blank.

**FR-022 — Edit Listing Before Claim** *(P1)*
The system shall allow the UMKM to edit a listing's details before it is claimed.
**Acceptance criteria:**
- Edits are permitted only while the listing is unclaimed.
- After a claim, edit is blocked and the UMKM must cancel the claim to modify.

**FR-023 — Withdraw Listing** *(P1)*
The system shall allow the UMKM to withdraw an unclaimed listing.
**Acceptance criteria:**
- Withdrawal removes the listing from the public feed immediately.
- The listing is marked "withdrawn" and remains visible to the UMKM for history.

**FR-024 — Listing Expiry** *(P0)*
The system shall automatically expire a listing when its pickup window passes without a confirmed handover.
**Acceptance criteria:**
- Expired listings are removed from the public feed.
- The UMKM sees the listing as "expired."
- Expiry is reflected in the impact recap.

**FR-025 — WhatsApp Share** *(P2)*
The system shall let the UMKM share a listing to WhatsApp in one action.
**Acceptance criteria:**
- The share action opens WhatsApp with a pre-filled message containing the listing summary.
- The shared message includes the listing's public link.

## 6.4 Browsing & Discovery (FR-030 – FR-039)

**FR-030 — Public Listing Feed** *(P0)*
The system shall display a public feed of currently available listings.
**Acceptance criteria:**
- The feed shows only unclaimed, unexpired, non-withdrawn listings.
- Each card shows food type, quantity, pickup window, purpose label, and verification badge.
- The feed is reachable without completing UMKM-style registration (browsing permitted per FR-002).

**FR-031 — Location Filter** *(P1)*
The system shall allow filtering listings by district within the pilot area (Karawang Barat, Telukjambe Timur, Karawang Timur).
**Acceptance criteria:**
- Selecting a district filters the feed to that district.
- "All districts" restores the full feed.
- Districts outside the pilot area are not offered.

**FR-032 — Pickup Window Display** *(P0)*
The system shall display each listing's pickup window clearly.
**Acceptance criteria:**
- Start and end times are shown on the card and detail view.
- Listings whose window has passed do not appear in the feed (per FR-024).

**FR-033 — Listing Detail View** *(P0)*
The system shall provide a detail view showing food type, cooking time, quantity, pickup window, purpose label, UMKM name, verification badge, and a Claim action.
**Acceptance criteria:**
- All fields from FR-020 are displayed.
- The Claim action is present and functional for eligible members.

**FR-034 — Purpose Filter** *(P2)*
The system shall allow filtering listings by purpose label.
**Acceptance criteria:**
- Selecting a purpose filters the feed accordingly.
- Clearing the filter restores all purposes.

## 6.5 Claiming & Handover (FR-040 – FR-049)

**FR-040 — Claim a Listing** *(P0)*
The system shall allow a community member to claim an available listing.
**Acceptance criteria:**
- A successful claim reserves the listing and prevents further claims (FR-042).
- The claimant receives a confirmation showing pickup details.
- The listing leaves the public feed once claimed.

**FR-041 — Claim Quota Enforcement** *(P0)*
The system shall enforce the claim quota defined in Business Rules.
**Acceptance criteria:**
- A member attempting to exceed the quota is blocked with a clear message.
- Quota state is evaluated at claim time against the member's claim history.

**FR-042 — Duplicate Claim Prevention** *(P0)*
The system shall prevent more than one active claim per listing.
**Acceptance criteria:**
- A second claim attempt on a reserved listing is rejected with "already claimed."
- Concurrent claim attempts resolve to exactly one successful claim.

**FR-043 — Handover Confirmation** *(P0)*
The system shall allow the UMKM to confirm handover when the recipient collects the food.
**Acceptance criteria:**
- Handover confirmation closes the listing as "completed."
- Only the owning UMKM (or the system) can confirm handover.
- The handover timestamp is recorded and reflected in the impact recap.

**FR-044 — No-Show Handling** *(P1)*
The system shall mark a claim as "no-show" if the pickup window closes without handover confirmation.
**Acceptance criteria:**
- The claim status becomes "no-show."
- The listing transitions to expired per FR-024.
- The no-show is recorded against the member's claim history.

## 6.6 Trust, Safety & Reporting (FR-050 – FR-059)

**FR-050 — Report a Listing or Handover** *(P0)*
The system shall allow a community member to report a listing or a handover problem with a reason.
**Acceptance criteria:**
- The report form requires a reason category and accepts optional free text.
- Submitted reports flag the listing for admin review.
- The reporter receives confirmation the report was received.

**FR-051 — Admin Report Handling** *(P1)*
The system shall allow an admin to review reports and take action: dismiss, warn the UMKM, suspend the UMKM, or remove the listing.
**Acceptance criteria:**
- Each action is recorded with admin identity, timestamp, and reason.
- Removing a listing removes it from the public feed immediately.
- The UMKM and reporter are notified of the outcome.

**FR-052 — Content Moderation of Listings** *(P1)*
The system shall prevent listings that violate platform rules from being published.
**Acceptance criteria:**
- Listings missing mandatory safety fields (FR-020, FR-021) cannot publish.
- A suspended UMKM cannot publish new listings.

## 6.7 Impact Reporting & Administration (FR-060 – FR-069)

**FR-060 — Impact Recap** *(P1)*
The system shall record and present a recap of listings published, claims made, and handovers completed.
**Acceptance criteria:**
- The recap shows counts by period and district.
- Completed handovers are counted as successful distributions.
- The recap is viewable by admins.

**FR-061 — Export Impact Report** *(P1)*
The system shall allow an admin to export the impact recap.
**Acceptance criteria:**
- Export produces a structured file (e.g., CSV) of the recap data.
- Exported data matches the on-screen recap for the same period.

**FR-062 — Audit Log** *(P1)*
The system shall log administrative and verification actions.
**Acceptance criteria:**
- Verification, moderation, and suspension actions are logged with actor, action, timestamp, and reason.
- Logs are retrievable by admins.

## 6.8 Edge Cases & Cross-Cutting Rules

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-070 | **Concurrent claim resolution** — when two members claim simultaneously, exactly one succeeds | P0 | Under concurrent attempts, one claim succeeds and the other receives "already claimed"; no double-reservation occurs |
| FR-071 | **Out-of-pilot-area listings** — listings outside the three pilot districts are not publishable | P0 | District selection is restricted to the pilot set; out-of-area submissions are rejected |
| FR-072 | **Expired-claim cleanup** — claims on expired listings are closed and quota is released per Business Rules | P1 | Expired claims no longer count against quota after the defined rule applies |
| FR-073 | **Notification of claim outcome** — claimant and UMKM are notified of claim, cancellation, and handover events | P1 | Each event generates a notification to the relevant party |
| FR-074 | **Data retention & privacy** — personal contact data is stored per the data requirements section and not exposed publicly | P0 | Public listing views do not reveal member contact details; only necessary data is shared between transacting parties |

> **Traceability note:** Every P0 user story in Section 5 maps to at least one P0 functional requirement above (e.g., US-04 → FR-020/FR-021; US-11 → FR-040/FR-041/FR-042; US-12 → FR-043; US-15 → FR-050). Non-functional requirements, user experience, technical architecture, and data requirements are specified in the following sections.

# Non-Functional Requirements

# Non-Functional Requirements

This section defines the measurable quality attributes that SIPANA must satisfy. Each requirement carries a unique identifier (NFR-XXX), a category, a target threshold, and a verification method. Thresholds are calibrated for the pilot scope (Karawang Barat, Telukjambe Timur, Karawang Timur) while allowing headroom for expansion across Karawang Regency. Where the source design document specifies a constraint, the requirement is marked **[Confirmed]**; where a reasonable engineering target is set to make the requirement testable, it is marked **[Derived]**.

## 7.1 Performance

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-001 | Server-rendered page response time (p95) for listing, detail, and dashboard pages on a 4G connection | ≤ 2.0 s Time to First Contentful Paint; ≤ 3.0 s Largest Contentful Paint | Lighthouse CI + synthetic monitoring (k6/WebPageTest) | [Derived] |
| NFR-002 | API response time (p95) for all read endpoints (`GET` listings, detail, history) | ≤ 500 ms server processing time, excluding third-party latency | APM tracing (OpenTelemetry) | [Derived] |
| NFR-003 | API response time (p95) for all write endpoints (create listing, claim, confirm handover) | ≤ 800 ms server processing time | APM tracing | [Derived] |
| NFR-004 | Concurrent user support at pilot launch (3 kecamatan, estimated 150 UMKM + 2,000 public users) | 100 concurrent active sessions sustained; 300 peak burst for 5 minutes without error rate > 1% | Load test (k6) before go-live | [Derived] |
| NFR-005 | Listing feed search/filter response (radius, category, peruntukan, availability window) | ≤ 1.0 s end-to-end for result sets up to 5,000 active listings | Load test with seeded dataset | [Derived] |
| NFR-006 | Photo upload and processing (client-side compression then server storage) | Upload of a 5 MB image completes ≤ 5 s on 4G; stored derivative ≤ 500 KB | Manual QA on reference devices | [Derived] |
| NFR-007 | Time-to-interactive on the "Posting Cepat" (fast listing) flow — the highest-priority UMKM feature per survey (64%) | ≤ 3 taps from dashboard to published listing; ≤ 45 s total median completion | Usability test + analytics funnel | [Confirmed: survey §2.2] |
| NFR-008 | Notification dispatch latency (in-app + WhatsApp deep link) after listing publish or claim event | ≤ 10 s p95 | Integration test with mocked provider | [Derived] |

## 7.2 Security

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-010 | Authentication | Email/password with Argon2id hashing (min. memory 19 MiB, iterations 2, parallelism 1); session via HTTP-only, Secure, SameSite=Lax cookies; optional Google OAuth | Code review + penetration test | [Derived] |
| NFR-011 | Transport encryption | TLS 1.2+ enforced (TLS 1.3 preferred); HSTS with `max-age=31536000; includeSubDomains`; no mixed content | SSL Labs grade A or better | [Derived] |
| NFR-012 | Data at rest | Database and object storage encrypted at rest (AES-256, provider-managed keys acceptable for pilot) | Infrastructure config audit | [Derived] |
| NFR-013 | Authorization | Role-based access control (RBAC) enforced server-side for roles: `public`, `umkm`, `admin`; every API route declares an explicit policy; cross-tenant access returns 403 | Automated authorization test suite | [Confirmed: design §12.8, §12.9] |
| NFR-014 | UMKM verification gate | Unverified UMKM accounts cannot publish listings; verification state checked on every publish request | Integration test | [Confirmed: design §5, §7] |
| NFR-015 | Input validation | All inputs validated server-side against schema (Zod); file uploads restricted to JPEG/PNG/WebP ≤ 5 MB with MIME sniffing; SQL injection and XSS prevented via parameterized queries and output encoding | OWASP ZAP scan + code review | [Derived] |
| NFR-016 | Rate limiting | Auth endpoints: 5 failed attempts per 15 min per IP+account, then lockout; listing/claim endpoints: 60 req/min per user; public read endpoints: 300 req/min per IP | Rate-limit test | [Derived] |
| NFR-017 | PII protection | Phone numbers and email addresses masked in public views; full PII visible only to the counterparty after a claim is confirmed and to admins | Manual QA + code review | [Derived] |
| NFR-018 | Audit logging | All admin actions (verification approve/reject, report resolution, account suspension) logged immutably with actor, timestamp, target, and reason | Log inspection | [Confirmed: design §14] |
| NFR-019 | Compliance | Compliance with Indonesia's UU PDP (UU No. 27/2022) for personal data: explicit consent at registration, documented retention policy, deletion-on-request workflow | Legal review + consent flow QA | [Derived] |

## 7.3 Reliability & Availability

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-020 | Uptime SLA (pilot phase) | 99.5% monthly availability measured at the load balancer, excluding announced maintenance windows | Uptime monitor (e.g., Better Stack) | [Derived] |
| NFR-021 | Planned maintenance | ≤ 4 hours/month, scheduled 01:00–05:00 WIB (lowest usage), announced ≥ 24 h in advance | Change log | [Derived] |
| NFR-022 | Database backup | Automated daily full backup with 30-day retention; point-in-time recovery to any point within 7 days | Restore drill (quarterly) | [Derived] |
| NFR-023 | Recovery objectives | RPO ≤ 24 h; RTO ≤ 4 h for full outage | Documented runbook + drill | [Derived] |
| NFR-024 | Graceful degradation | If WhatsApp notification provider fails, in-app notifications and listing visibility continue functioning; failures queued and retried with exponential backoff (max 3 attempts) | Chaos test (provider mock failure) | [Derived] |
| NFR-025 | Error handling | All unhandled errors return a structured JSON error envelope and are captured in error tracking (Sentry) with trace ID; user-facing pages show a friendly fallback, never a stack trace | QA + Sentry review | [Derived] |
| NFR-026 | Data integrity | Claim and handover-confirmation operations are transactional; concurrent claims on the same listing resolve with exactly one success and the rest receiving a "sudah diklaim" (already claimed) response | Concurrency test (parallel claim simulation) | [Confirmed: design §7 — kuota klaim] |

## 7.4 Scalability

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-030 | Horizontal scalability | Stateless application servers behind a load balancer; session state externalized; scale to 3× pilot capacity by adding instances without code changes | Architecture review + scale test | [Derived] |
| NFR-031 | Data volume | Support 50,000 listings, 20,000 user accounts, and 200,000 claim/handover records without query degradation beyond NFR-002/003 thresholds | Load test at 10× pilot volume | [Derived] |
| NFR-032 | Geographic expansion | Kecamatan/district is a first-class data field; adding a new kecamatan requires configuration only (no schema migration) | Code review | [Confirmed: design §1 — cakupan awal] |
| NFR-033 | Storage growth | Object storage for listing photos scales independently of compute; lifecycle policy archives photos > 90 days to cold storage | Infrastructure config | [Derived] |

## 7.5 Usability & Accessibility

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-040 | Accessibility standard | WCAG 2.1 Level AA conformance across all public and authenticated screens | axe-core automated scan (0 critical/serious) + manual audit | [Confirmed: design §12.1 — aksesibilitas] |
| NFR-041 | Color contrast | Text contrast ratio ≥ 4.5:1 (normal text) and ≥ 3:1 (large text and UI components) against the SIPANA palette | Contrast checker on design tokens | [Confirmed: design §12.2] |
| NFR-042 | Keyboard navigation | All interactive elements reachable and operable via keyboard; visible focus indicator (≥ 2 px outline, contrast ≥ 3:1); no keyboard traps | Manual keyboard-only walkthrough | [Derived] |
| NFR-043 | Screen reader support | Semantic HTML landmarks, ARIA labels on icon-only buttons, form fields with programmatic labels and error associations; tested with NVDA + Chrome and TalkBack + Android Chrome | Screen reader test script | [Derived] |
| NFR-044 | Touch target size | Minimum 44×44 CSS px for all tappable elements (mobile viewport) | Design token audit + device QA | [Derived] |
| NFR-045 | Language & readability | All UI copy in Bahasa Indonesia; body text readability target setara kelas 8 (plain language), consistent with survey respondents' preference for easy-to-use interfaces | Content review | [Confirmed: survey §2.2 — "website nya mudah di pakai"] |
| NFR-046 | Onboarding clarity | New UMKM users can complete first listing without external help; measured by ≥ 80% task success in moderated usability test with 5 users | Usability test | [Confirmed: survey §2.2 — 7/11 bersyarat "tergantung kemudahan"] |
| NFR-047 | Error recovery | Form validation errors shown inline, in Bahasa Indonesia, with a corrective instruction; no data loss on validation failure | QA test cases | [Derived] |

## 7.6 Compatibility

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-050 | Browser support | Latest 2 major versions of Chrome, Edge, Firefox, Safari (desktop and iOS/Android); graceful degradation (functional, not pixel-perfect) on older Android WebView ≥ Chrome 90 | BrowserStack matrix | [Derived] |
| NFR-051 | Device support | Responsive from 360 px to 1920 px viewport width; primary design target is landscape web (desktop/tablet) with a fully functional mobile portrait layout, since survey respondents are predominantly mobile-first factory workers and small vendors | Device lab + responsive QA | [Confirmed: design §12.1 — landscape web; survey §2.1] |
| NFR-052 | Network conditions | Core flows (browse, claim, confirm) usable on 3G (~1.6 Mbps) and resilient to intermittent connectivity; optimistic UI with retry on failure | Throttled network test | [Derived] |
| NFR-053 | PWA baseline | Installable to home screen; offline shell caches last-viewed listing detail; no offline write capability in pilot | Lighthouse PWA audit | [Derived] |

## 7.7 Maintainability & Operability

| ID | Requirement | Target / Threshold | Verification | Source |
|---|---|---|---|---|
| NFR-060 | Code quality | TypeScript strict mode; ≥ 70% unit test coverage on business-logic modules (claim rules, verification, quota); lint and type checks block CI merge | CI pipeline | [Derived] |
| NFR-061 | Observability | Structured JSON logs with correlation IDs; APM traces for all API routes; dashboards for error rate, latency (p50/p95/p99), claim success rate, notification delivery rate | Observability stack review | [Derived] |
| NFR-062 | Deployment | Automated CI/CD: every merge to `main` deploys to staging; production deploy requires manual approval; rollback to previous release ≤ 10 min | Deploy rehearsal | [Derived] |
| NFR-063 | Documentation | Architecture decision records (ADRs), API reference (OpenAPI 3.1), and operational runbook maintained in-repo | Doc review at each milestone | [Derived] |
| NFR-064 | Configuration | Environment-specific config via environment variables; no secrets in source control; secrets managed via platform secret store | Secret scan in CI | [Derived] |

# User Experience & Design

# User Experience & Design

## 8.1 Design Principles

The UX is anchored in five principles derived directly from survey findings and the design system in the source document (§12):

1. **Kecepatan di atas segalanya (Speed first).** "Posting cepat" was the single most requested UMKM feature (7/11, 64%). Every UMKM screen is optimized so a vendor can publish surplus food in under 45 seconds with minimal typing. Defaults are pre-filled from the vendor's profile (location, typical category, typical pickup window).
2. **Kepercayaan terlihat (Visible trust).** 55% of UMKM fear being blamed if a recipient gets sick (survey §2.2). Trust signals — verified badge, "jam masak" (cooking time), peruntukan label (consumption vs. animal feed), and the report button — are surfaced on every listing card and detail view, not buried in settings.
3. **Dua audiens, dua wajah (Two audiences, two interfaces).** The recipient experience and the UMKM experience are visually and navigationally distinct (design §12.8), sharing a design system but diverging in information architecture, home screen, and primary calls-to-action.
4. **Ramah pengguna baru (Beginner-friendly).** 64% of UMKM said "maybe, depending on ease of use." Plain-language Bahasa Indonesia, inline guidance, and a first-time onboarding checklist reduce the learning curve.
5. **Aksesibel dan inklusif.** WCAG 2.1 AA is a hard requirement (NFR-040). Large touch targets, high contrast, and screen-reader semantics are built into the design tokens, not retrofitted.

## 8.2 Design System Reference

The visual identity follows the SIPANA design system defined in source §12.2–12.4:

| Token group | Guidance |
|---|---|
| **Primary palette** | Green-forward palette signaling food, freshness, and sustainability; contrast-checked against white and neutral surfaces to meet NFR-041 |
| **Semantic colors** | Success (claim confirmed), warning (expiring soon), danger (report/expired), info (verification pending) — each with text-safe contrast pairs |
| **Typography scale** | Modular scale with clear H1–H4 hierarchy, minimum 16 px body text on mobile, line-height ≥ 1.5 for body |
| **Spacing** | 4 px base unit; consistent 8/12/16/24/32 px rhythm |
| **Components** | Buttons (primary/secondary/ghost/danger), input fields with inline validation, cards, badges (verified, peruntukan, status), modal/dialog, toast, empty states, skeleton loaders |
| **Iconography** | Consistent line-icon set with text labels for critical actions (never icon-only for destructive or safety-relevant actions) |
| **Implementation** | Tailwind CSS v4 with design tokens declared in `index.css` (source §12.4), consumed by a shared component library so both interfaces stay visually consistent |

## 8.3 Navigation Patterns

**Public / Recipient interface** — bottom tab bar on mobile, top nav on desktop:
- **Beranda (Home):** nearby available listings, filter chips (radius, category, peruntukan, pickup window), search.
- **Jelajahi (Explore):** map/list hybrid with radius filter.
- **Klaim Saya (My Claims):** active claims with countdown to pickup deadline, handover status, history.
- **Profil (Profile):** account, notification preferences, terms acceptance status, report history.

**UMKM interface** — dashboard-centric, left sidebar on desktop, bottom tab bar on mobile:
- **Dasbor (Dashboard):** quick "Posting Cepat" CTA, active listings, incoming claims awaiting handover confirmation, impact summary (portions distributed).
- **Listing Saya (My Listings):** list with status (active/claimed/expired/completed), edit/close actions.
- **Klaim Masuk (Incoming Claims):** claims awaiting confirmation, recipient masked contact revealed post-confirmation.
- **Laporan Dampak (Impact Report):** monthly recap of portions distributed, claims fulfilled, categories.
- **Profil & Verifikasi (Profile & Verification):** verification status, documents, business info.

**Admin interface** — separate authenticated area: verification queue, report/moderation queue, user management, audit log, platform metrics.

## 8.4 Critical User Journeys

### Journey A — UMKM publishes surplus food (primary UMKM flow)

```
Login → Dasbor → [Posting Cepat] → Form (pre-filled defaults)
   → Confirm category, portion count, pickup window, peruntukan label,
     cooking time, photo (optional but encouraged)
   → Publish → Listing live → Confirmation toast + shareable WhatsApp link
```

- **Target:** ≤ 3 taps to the form, ≤ 45 s median completion (NFR-007).
- **Error/alt flows:** unverified account → blocked with clear CTA to verification; missing required fields → inline validation; photo upload failure → listing can publish without photo, with a non-blocking warning.
- **Design notes:** large "Posting Cepat" button is the visual anchor of the dashboard; form uses sensible defaults and a single-screen layout on desktop, a 2-step wizard on mobile.

### Journey B — Recipient discovers and claims a listing (primary recipient flow)

```
Beranda → Filter by radius/category → Listing card (trust signals visible)
   → Detail page (photo, jam masak, peruntukan, pickup window, distance,
     vendor verified badge, report button)
   → [Klaim] → Confirm terms (first time only) → Claim created
   → Pickup countdown shown → Meet vendor → Vendor confirms handover
   → Recipient sees "Selesai" + can leave optional feedback
```

- **Error/alt flows:** listing already claimed → "sudah diklaim" state with similar nearby listings; expired pickup window → listing auto-archived, claim marked expired; recipient cancels claim → slot released back to pool within quota rules.
- **Design notes:** countdown timer on active claims is prominent; contact info masked until claim confirmed (NFR-017).

### Journey C — Vendor confirms handover

```
Klaim Masuk → Claim detail → [Konfirmasi Serah Terima]
   → Confirmation dialog → Handover recorded → Impact counter increments
```

- **Error/alt flows:** recipient no-show → vendor marks "tidak diambil" (not picked up); claim auto-expires after pickup window; dispute → report flow.

### Journey D — Reporting a safety concern

```
Any listing/user → [Lapor] → Reason selection (food safety, misrepresentation,
   inappropriate behavior, other) → Optional description → Submit
   → Confirmation → Admin queue → Resolution notification to reporter
```

- **Design notes:** report button reachable within one tap from listing detail; report flow is ≤ 3 steps; reporters receive status updates.

### Journey E — UMKM verification

```
Register → Role selection (UMKM) → Business info + supporting documents
   → Submit → "Menunggu verifikasi" state (cannot publish yet)
   → Admin reviews → Approved/Rejected → Email/in-app notification
```

## 8.5 Screen Inventory (High-Level)

| Screen | Interface | Priority |
|---|---|---|
| Landing / value proposition | Public | P1 |
| Registration & login | Public | P0 |
| Recipient home (nearby listings) | Recipient | P0 |
| Listing detail | Shared | P0 |
| Claim confirmation & active claim | Recipient | P0 |
| My claims / history | Recipient | P0 |
| UMKM dashboard | UMKM | P0 |
| Posting Cepat form | UMKM | P0 |
| My listings & incoming claims | UMKM | P0 |
| Handover confirmation | UMKM | P0 |
| Verification submission & status | UMKM | P0 |
| Impact report | UMKM | P1 |
| Report/moderation flow | Shared | P1 |
| Admin verification queue | Admin | P0 |
| Admin report queue | Admin | P1 |
| Admin user management & audit log | Admin | P1 |
| Profile & notification settings | Shared | P1 |
| Terms & conditions acceptance | Public | P0 |

## 8.6 Accessibility Considerations

- All flows validated against NFR-040–NFR-047: WCAG 2.1 AA, keyboard operability, screen reader semantics, 44 px touch targets, and 4.5:1 contrast.
- Countdown timers and auto-expiring states announce changes via ARIA live regions.
- Color is never the sole carrier of meaning (status badges include text labels and icons).
- Forms use programmatic label association and inline error text referenced by `aria-describedby`.

# Technical Architecture

# Technical Architecture

## 9.1 Recommended Tech Stack

The source design document (§13) specifies a fullstack JavaScript/TypeScript approach. The stack below is a concrete instantiation of that direction, chosen for team familiarity (a student/course project team), deployment simplicity, and the ability to satisfy the NFRs above without over-engineering for pilot scale.

| Layer | Technology | Justification |
|---|---|---|
| **Frontend framework** | Next.js 15 (App Router) with React 19 and TypeScript (strict) | Server-side rendering improves first-paint performance on low-end mobile (NFR-001); App Router enables route-level middleware for role-based access (source §12.9); strong ecosystem for Tailwind and forms |
| **Styling** | Tailwind CSS v4 with design tokens in `index.css` | Matches the source design system (§12.4); utility-first speeds UI delivery; tokens enforce accessibility contrast (NFR-041) |
| **UI components** | shadcn/ui (Radix primitives) customized to SIPANA tokens | Accessible-by-default primitives (WCAG-aligned) reduce accessibility risk (NFR-040); headless components allow brand customization |
| **Forms & validation** | React Hook Form + Zod | Shared schemas between client and server; inline validation (NFR-047); server-side enforcement (NFR-015) |
| **Backend** | Next.js Route Handlers (Node.js runtime) + tRPC (or REST with OpenAPI 3.1) | Single-language fullstack reduces context switching; tRPC gives end-to-end type safety; REST/OpenAPI alternative if external consumers are anticipated |
| **Database** | PostgreSQL 16 (managed: Supabase or Neon) | Relational integrity for claims/handover transactions (NFR-026); PostGIS available for radius queries (NFR-005); matches ERD in source §10 |
| **ORM / migrations** | Prisma | Type-safe queries, migration tooling, aligns with the SQL schema in source §11 |
| **Authentication** | Auth.js (NextAuth) with credentials + optional Google OAuth; Argon2id hashing | Satisfies NFR-010; session cookies HTTP-only/Secure; integrates with Next.js middleware for RBAC (NFR-013) |
| **File storage** | S3-compatible object storage (Supabase Storage or Cloudflare R2) | Independent scaling for photos (NFR-033); CDN delivery reduces LCP (NFR-001) |
| **Notifications** | In-app notifications (DB-backed) + WhatsApp deep links (wa.me) for pilot; optional WhatsApp Business API adapter behind a feature flag | Survey respondents explicitly requested WhatsApp linkage; deep links need no paid API for pilot, with a clean upgrade path |
| **Background jobs** | Vercel Cron or a lightweight queue (e.g., Upstash QStash) for expiry sweeps and notification retries | Handles listing/claim expiry and retry logic (NFR-024) without a full job-queue cluster |
| **Observability** | Sentry (errors) + OpenTelemetry traces + platform logs; Better Stack uptime monitor | Satisfies NFR-025 and NFR-061 |
| **Hosting** | Vercel (app) + managed Postgres + object storage | Zero-ops for pilot; horizontal scale via serverless (NFR-030); supports staging/prod separation (NFR-062) |
| **CI/CD** | GitHub Actions: lint, typecheck, unit tests, Playwright e2e, preview deploys | Enforces NFR-060; preview environments accelerate QA |

**Justification summary:** The stack is deliberately conventional and managed. At pilot volume (≤ 100 concurrent users, ≤ 50,000 listings), a serverless/managed architecture comfortably meets performance and reliability targets while minimizing operational burden for a small team. Every choice has a documented upgrade path (e.g., dedicated Postgres with read replicas, WhatsApp Business API) if expansion demands it.

## 9.2 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Client (Browser / PWA)                      │
│  Next.js App (SSR + Client Components) · Tailwind · shadcn/ui        │
│  Interfaces: Public · Recipient · UMKM · Admin                       │
└───────────────┬─────────────────────────────────────────────────────┘
                │ HTTPS (TLS 1.3)
┌───────────────▼─────────────────────────────────────────────────────┐
│                     Edge / CDN (Vercel Edge Network)                  │
│  Static assets · Image optimization · WAF · Rate limiting (edge)     │
└───────────────┬─────────────────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────────────────┐
│                   Application Layer (Next.js Server)                  │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────────────────┐   │
│  │ Route        │  │ Auth.js       │  │ Middleware (RBAC routing, │   │
│  │ Handlers /   │  │ (sessions,    │  │ role guards, redirects)   │   │
│  │ tRPC         │  │ OAuth)        │  │                          │   │
│  └──────┬───────┘  └───────┬───────┘  └────────────┬─────────────┘   │
│         │                  │                        │                │
│  ┌──────▼──────────────────▼────────────────────────▼─────────────┐  │
│  │ Service Layer: ListingService · ClaimService · HandoverService │  │
│  │ VerificationService · ReportService · NotificationService      │  │
│  │ ImpactService · AuditService                                   │  │
│  └──────┬───────────────────────────────────────────────┬─────────┘  │
└─────────┼───────────────────────────────────────────────┼────────────┘
          │ Prisma                                         │ Adapters
┌─────────▼──────────────┐                   ┌─────────────▼─────────────┐
│   PostgreSQL (managed) │                   │  Object Storage (S3/R2)   │
│   + PostGIS (radius)   │                   │  Listing photos, docs     │
│   Backups, PITR        │                   └───────────────────────────┘
└────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────────────┐
│  Async / Integrations                                                │
│  Cron: expiry sweeps · Notification retries                          │
│  Notification adapter: In-app (DB) + WhatsApp deep link / Business   │
│  Error tracking: Sentry · Traces: OpenTelemetry · Uptime monitor     │
└─────────────────────────────────────────────────────────────────────┘
```

**Component responsibilities:**

- **Client:** renders the four interfaces; performs client-side image compression before upload (NFR-006); optimistic UI for claim actions with retry.
- **Edge/CDN:** caches static assets and optimized images; applies coarse rate limits (NFR-016) before requests reach the app.
- **Middleware:** enforces role-based routing (source §12.9) — e.g., `/umkm/*` requires `umkm` role and verified status; `/admin/*` requires `admin` role; unauthenticated users are redirected to login.
- **Service layer:** encapsulates business rules (claim quota, verification gate, handover transactionality, expiry) so they are testable and consistently enforced across API routes.
- **PostgreSQL:** single source of truth; PostGIS powers radius search (NFR-005); transactions guarantee exactly-one-claim (NFR-026).
- **Object storage:** stores photos and verification documents; access via signed URLs.
- **Async layer:** cron-driven expiry sweeps (listing and claim windows) and notification retries with backoff (NFR-024).

## 9.3 Data Flow — Claim and Handover (text diagram)

```
1. Recipient taps [Klaim] on listing detail
   → Client POST /api/claims { listingId }
2. Server (ClaimService):
   a. Auth check (session valid, role allowed)
   b. Load listing FOR UPDATE (row lock)
   c. Validate: listing active, not expired, quota not exceeded,
      recipient not over personal claim limit, terms accepted
   d. Create claim record (status = CLAIMED), decrement available quota
   e. Commit transaction
3. NotificationService:
   a. In-app notification to vendor (DB insert)
   b. WhatsApp deep-link payload returned to recipient UI
   c. Async: retry-safe delivery log
4. Vendor confirms handover:
   → POST /api/claims/{id}/handover
   → HandoverService validates vendor ownership + claim status
   → Mark claim COMPLETED, listing quantity updated or closed
   → ImpactService increments vendor impact counters
5. Recipient notified (in-app) that handover is confirmed
6. Cron sweeps any claim past pickup window → status EXPIRED,
   quota released per business rules
```

## 9.4 Third-Party Integrations

| Integration | Purpose | Dependency type | Fallback |
|---|---|---|---|
| WhatsApp deep link (`wa.me`) | Contact between recipient and vendor after claim; share listing link | Link-out only (no API dependency) | In-app masked contact reveal |
| WhatsApp Business API (optional, feature-flagged) | Automated notifications to vendors/recipients | External service (paid) | In-app notifications + deep links |
| Google OAuth (optional) | Faster registration | External IdP | Email/password |
| Google Maps / Leaflet + OpenStreetMap | Map view and radius selection | Map tiles | List-only view with distance sort |
| Sentry | Error tracking | SaaS | Platform logs |
| Uptime monitor | Availability tracking (NFR-020) | SaaS | Manual checks |

## 9.5 Infrastructure Requirements

| Resource | Pilot specification | Notes |
|---|---|---|
| **Application hosting** | Vercel Pro (or equivalent serverless platform) | Serverless functions auto-scale (NFR-030); preview environments for QA |
| **Database** | Managed PostgreSQL 16, ≥ 2 vCPU / 4 GB RAM, 50 GB storage, daily backups + PITR | PostGIS enabled; connection pooling (PgBouncer) |
| **Object storage** | ≥ 100 GB with CDN; lifecycle policy to cold storage after 90 days | NFR-033 |
| **Environments** | `development`, `staging`, `production` — isolated databases and storage buckets | NFR-062 |
| **Secrets management** | Platform secret store; rotation policy for API keys | NFR-064 |
| **Monitoring** | Sentry, OpenTelemetry collector, uptime monitor, log retention ≥ 30 days | NFR-061 |
| **Network** | TLS termination at edge; HSTS; WAF rules for common OWASP threats | NFR-011, NFR-015 |

## 9.6 Architecture Decisions & Trade-offs

- **Monolith over microservices:** At pilot scale, a modular monolith (Next.js + service layer) minimizes operational overhead and keeps transactions simple (NFR-026). Service boundaries are drawn in code so extraction is possible later.
- **Managed services over self-hosted:** Reduces ops burden for a small team; trade-off is vendor lock-in, mitigated by standard protocols (Postgres, S3-compatible storage).
- **WhatsApp deep links before Business API:** Delivers the survey-requested WhatsApp linkage without paid API cost or approval lead time; the notification adapter abstracts the provider so upgrading is a configuration change.
- **SSR-first rendering:** Chosen for performance on low-end devices (NFR-001, NFR-052) and SEO for the public landing/listing pages; client components used only where interactivity requires them.

---

# Data Requirements



# Timeline & Milestones

The SIPANA data model is derived directly from the ERD in source §10 and the SQL script in source §11. The following seven core entities and their relationships form the persistence layer.

| Entity | Purpose | Key Attributes | Relationships |
|---|---|---|---|
| **`users`** | Single account table for all roles (UMKM owner, recipient, admin) | `id`, `name`, `email` (unique), `phone` (WhatsApp), `password_hash`, `role` (`umkm` \| `penerima` \| `admin`), `status` (`pending` \| `verified` \| `rejected` \| `suspended`), `created_at`, `updated_at` | 1:1 → `umkm_profiles` (if role=umkm); 1:N → `listings` (as giver); 1:N → `claims` (as recipient); 1:N → `reports` |
| **`umkm_profiles`** | Verification and business data for UMKM accounts | `user_id` (PK/FK), `business_name`, `business_type`, `address`, `district` (kecamatan), `ktp_number`, `ktp_photo_url`, `business_photo_url`, `verified_by` (admin user_id), `verified_at`, `rejection_reason` | N:1 → `users`; 1:N → `listings` |
| **`listings`** | A surplus-food posting created by a UMKM | `id`, `umkm_id` (FK), `title`, `description`, `food_category` (`kue_roti` \| `makanan_matang` \| `olahan`), `portion_count`, `cooked_at` (timestamp), `pickup_deadline` (timestamp), `pickup_address`, `purpose_label` (`konsumsi_manusia` \| `pakan_ternak` \| `keduanya`), `status` (`active` \| `claimed` \| `completed` \| `expired` \| `cancelled`), `photo_url`, `created_at`, `updated_at` | N:1 → `umkm_profiles`; 1:N → `claims` |
| **`claims`** | A recipient's reservation of a listing | `id`, `listing_id` (FK), `recipient_id` (FK), `portion_claimed`, `status` (`reserved` \| `confirmed` \| `cancelled` \| `no_show`), `claimed_at`, `confirmed_at`, `pickup_code` (6-char), `cancellation_reason` | N:1 → `listings`; N:1 → `users` |
| **`reports`** | Misuse/quality reports filed by any user | `id`, `reporter_id` (FK), `target_type` (`listing` \| `user`), `target_id`, `category`, `description`, `status` (`open` \| `reviewing` \| `resolved` \| `dismissed`), `resolution_note`, `created_at`, `resolved_at` | N:1 → `users` |
| **`notifications`** | In-app + WhatsApp notification log | `id`, `user_id` (FK), `type`, `payload` (JSON), `channel` (`in_app` \| `whatsapp`), `delivery_status` (`queued` \| `sent` \| `failed`), `sent_at`, `read_at` | N:1 → `users` |
| **`audit_logs`** | Immutable record of admin and status-changing actions | `id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before_state` (JSON), `after_state` (JSON), `created_at` | N:1 → `users` |

**Relationship summary:** `users` (1) ── (0..1) `umkm_profiles` (1) ── (0..N) `listings` (1) ── (0..N) `claims` (N) ── (1) `users`. A listing may receive multiple claims up to its `portion_count`; a recipient may hold at most **one active claim per listing** (enforced by a unique partial index on `(listing_id, recipient_id) WHERE status IN ('reserved','confirmed')`).

# Success Metrics & KPIs

| Concern | Specification | Rationale |
|---|---|---|
| **Primary database** | PostgreSQL 16 (managed instance, e.g., Supabase/Neon), single region closest to Indonesia (Singapore) | Relational integrity for claims/quotas; JSONB support for notification payloads and audit diffs |
| **Object storage** | S3-compatible bucket (Cloudflare R2) for KTP photos, business photos, listing photos | KTP photos are sensitive; R2 avoids egress cost and supports signed URLs |
| **Estimated volume (Year 1)** | ~500 UMKM, ~150 listings/week at peak, ~5,000 claims/month, ~2 GB media/month | Sizing based on pilot target of 3 kecamatan (see §11) |
| **Media constraints** | Max 5 MB per image; JPEG/PNG/WebP only; server-side resize to 1200px max dimension; EXIF stripped | Prevents storage abuse; removes geolocation metadata from user photos |
| **Retention** | Listings & claims retained **24 months** (impact reporting); KTP photos **deleted 90 days after verification decision** (only `verified_at` + hash retained); notifications **90 days**; audit logs **36 months** | Balances UU PDP minimization with reporting needs |

# Risks & Mitigations

# Risks & Mitigations

This section consolidates the risk register for SIPANA. Risks are categorized as **Technical**, **Business**, **Market/Adoption**, and **Timeline**. Each risk is assigned a Likelihood and Impact rating (High / Medium / Low), a concrete mitigation strategy grounded in the design decisions documented in §6–§13, and a contingency plan if the risk materializes. Risk ownership and review cadence are noted so the register remains a living artifact throughout the November milestone (§11).

## 13.1 Risk Rating Methodology

| Rating | Likelihood | Impact |
|---|---|---|
| **High** | Expected to occur (>60% probability) within the project window | Threatens core value proposition, safety, or launch date; requires scope change |
| **Medium** | Plausible (20–60%) — has precedent in comparable projects | Degrades a secondary feature or requires rework within a sprint |
| **Low** | Unlikely (<20%) but non-trivial if it occurs | Minor inconvenience; absorbable within existing buffer |

Risk exposure = Likelihood × Impact. Any **High × High** combination triggers escalation to the project lead within 48 hours.

## 13.2 Risk Register

### R-01 — Food Safety Liability & Legal Exposure from Distributed Surplus

| Attribute | Detail |
|---|---|
| **Category** | Business / Legal |
| **Likelihood** | Medium |
| **Impact** | High |
| **Exposure** | High |

**Description.** The survey (§2.2) shows **6 of 11 UMKM (55%)** cite fear of being sued if a recipient falls ill as their primary hesitation. If a recipient becomes ill after consuming a distributed item and SIPANA cannot demonstrate documented due diligence, the platform's credibility — and potentially the UMKM's willingness to participate at all — collapses. This is the single most cited barrier to adoption in the source data.

**Mitigation.**
1. **Mandatory Terms & Conditions acceptance** at UMKM registration and at each listing publication (FR-012), explicitly recording the giver's declaration that the food is fit for consumption at time of listing.
2. **Structured food-safety fields** on every listing: cooking time (`jam_masak`), expiry/consume-by time (`batas_ambil`), and a per-listing **peruntukan label** (human consumption vs. animal feed) — see §7 Business Rules and FR-006.
3. **Verified UMKM onboarding** (FR-002) with admin approval gate, reducing anonymous/untraceable listings.
4. **In-app "Lapor" (report) button** on every listing and claim record, with admin triage workflow (FR-014) so incidents are logged, investigated, and resolved with an audit trail.
5. **Immutable audit log** of listing creation, claim, and handover confirmation timestamps (§10, `konfirmasi_serah_terima`), providing evidentiary record of the chain of custody.
6. Legal disclaimer in T&C clarifying SIPANA is a **matching platform**, not a food producer, and that the giver warrants fitness at handover.

**Contingency.** If an incident occurs: (a) freeze the affected UMKM account pending review; (b) preserve audit records; (c) publish a transparent incident note to affected claimants; (d) engage the faculty advisor / legal counsel referenced in the academic context; (e) if liability exposure proves unmanageable within the academic pilot, restrict the pilot to **non-perishable packaged goods** (kue kering, roti kemasan) only until a formal legal review is completed.

---

### R-02 — Low UMKM Supply Volume & Listing Abandonment

| Attribute | Detail |
|---|---|
| **Category** | Market / Adoption |
| **Likelihood** | High |
| **Impact** | High |
| **Exposure** | Critical |

**Description.** Survey data (§2.2) shows surplus is **small and volatile**: 91% of UMKM have leftovers, but **all are under 10 portions/day**, and only 73% know their surplus before 15:00. Only **4 of 11 (36%)** said a definite "yes" to using the website; **7 of 11 (64%)** said "maybe, depending on ease of use." If listing friction is even slightly high, UMKM will revert to informal distribution (which 91% already do successfully). A platform with no live listings has no value to recipients — a classic cold-start failure.

**Mitigation.**
1. **"Posting cepat" (fast listing)** is the top-requested feature (7/11, 64%) and is a **Must Have** (FR-005). Target: publish a listing in **≤3 taps / ≤30 seconds** with sensible defaults (auto-fill giver location, default pickup window, template portions).
2. **WhatsApp deep-link sharing** on every published listing (survey free-text explicitly requested "link ke WA" / "chat ke WA") — lets UMKM broadcast to their existing customer groups, driving recipient demand without platform-side marketing.
3. **Onboarding concierge** for the first 10 UMKM in the three pilot kecamatan: assisted first listing to prove the 30-second claim.
4. **Reciprocal visibility**: recipients who claim are shown the giver's name/business, giving UMKM reputational upside (survey noted "khawatir merusak citra" as a concern — reframe as a *positive* image benefit).
5. **Seed supply** during pilot: recruit the 11 surveyed UMKM directly as founding partners with a personal onboarding session.

**Contingency.** If live listing volume stays below the pilot target (see §12 KPIs) after 4 weeks: (a) run a **manual daily listing drive** where an admin posts on behalf of consenting UMKM via a simple WhatsApp intake; (b) narrow the pilot to a **single kecamatan** (Karawang Barat, the largest respondent cluster) to concentrate demand and make the marketplace feel active; (c) extend the pilot timeline before public launch rather than launch into an empty marketplace.

---

### R-03 — Recipient Trust, Safety & No-Show Behavior

| Attribute | Detail |
|---|---|
| **Category** | Market / Operational |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Exposure** | Medium |

**Description.** Recipients must trust that food is safe and that pickup is real. Survey data (§2.3) shows **9 of 14 (64%)** have *never* obtained free/discounted surplus from UMKM — there is no established habit or trust baseline. Additionally, if recipients claim items and fail to show up ("no-show"), UMKM lose confidence and stop listing. The source specifies a **kuota klaim** (claim quota) business rule (§7) precisely to manage this.

**Mitigation.**
1. **Claim quota enforcement** (FR-009): a per-recipient active-claim limit prevents hoarding and reserves items for genuine claimants.
2. **Handover confirmation** (FR-010): both parties confirm handover, producing a completion record and releasing quota; unconfirmed claims auto-expire at `batas_ambil`.
3. **Recipient accountability**: repeated no-shows reduce claim priority / trigger a cooldown (configurable in §7 Business Rules).
4. **Clear listing metadata** (cooking time, portions remaining, pickup window, peruntukan) so recipients self-select accurately.
5. **Report mechanism** (FR-014) for both directions — recipients can flag unsafe listings, givers can flag abusive claimants.

**Contingency.** If no-show rate exceeds the pilot threshold in §12: (a) shorten default pickup windows to increase urgency; (b) introduce a light recipient "reliability" indicator; (c) require phone verification for recipients before their first claim.

---

### R-04 — Timeline Compression & Academic Deadline Risk

| Attribute | Detail |
|---|---|
| **Category** | Timeline |
| **Likelihood** | Medium |
| **Impact** | High |
| **Exposure** | High |

**Description.** The work plan (§17) targets completion before **November**, driven by the course deadline and journal submission. The scope is broad for a student team: full-stack web app, two distinct interfaces (recipient vs. UMKM, §12.8), admin verification, audit logging, and black-box testing (§15). Any slippage in the data model or auth/middleware layer cascades into UI and testing.

**Mitigation.**
1. **MoSCoW prioritization** already established in §6: Must-Have features (registration, verification, fast listing, browse, claim with quota, handover confirmation, report, admin approval) are built first; Should/Could-Have features (notifications, impact reports, advanced filters) are deferred if the schedule tightens.
2. **Freeze the data model early**: the ERD (§10) and SQL script (§11) are already defined — treat schema as locked after sprint 1 to avoid migration churn.
3. **Two-interface architecture** (§12.8) built on a shared component library and route middleware (§12.9) to avoid duplicating work.
4. **Weekly milestone checkpoints** against §17; any milestone slipping >3 days triggers a scope triage meeting.
5. **Black-box test cases** (§15) authored in parallel with development so QA is not a serial bottleneck.

**Contingency.** If the November date is at risk: (a) cut Could-Have features and ship the Must-Have core; (b) reduce pilot to one kecamatan; (c) present a working core with a documented roadmap for deferred features rather than a partially-working full scope. The academic deliverable (design document + working prototype) is prioritized over feature completeness.

---

### R-05 — Survey Sample Limitations Undermining Design Validity

| Attribute | Detail |
|---|---|
| **Category** | Market / Research Validity |
| **Likelihood** | High |
| **Impact** | Medium |
| **Exposure** | Medium |

**Description.** The source document explicitly warns (§2) that the sample is **n=25, non-probability, network-distributed**, and that respondents skew positive toward new ideas. Design decisions (e.g., 82% kue/roti focus, before-15:00 surplus timing) may not generalize to all Karawang UMKM. Building narrowly on a biased sample risks a product that fits the respondents but not the market.

**Mitigation.**
1. **Treat survey findings as directional hypotheses**, not validated facts — documented explicitly in the assumptions in §3 and this register.
2. **Design for category flexibility**: the `peruntukan` label and food-type fields accommodate non-confectionery surplus even though kue/roti dominates the sample.
3. **Instrument the pilot** (§14, §12 KPIs) to capture real behavioral data (actual listing categories, actual surplus timing, actual claim rates) that supersedes survey assumptions.
4. **Validate with a second, larger sample** if the project extends beyond the course; note this as a post-pilot action.

**Contingency.** If pilot data contradicts survey assumptions (e.g., surplus arrives after 18:00, not before 15:00), adjust default pickup-window logic and listing templates based on observed data rather than re-litigating the survey.

---

### R-06 — Data Privacy, Security & Account Integrity

| Attribute | Detail |
|---|---|
| **Category** | Technical / Security |
| **Likelihood** | Medium |
| **Impact** | Medium |
| **Exposure** | Medium |

**Description.** The platform stores personal data (names, contact/WhatsApp numbers, locations) for both UMKM and recipients, plus verification documents for UMKM. Weak auth, exposed endpoints, or unvalidated input could leak PII or allow fake listings. The middleware route architecture (§12.9) separates the two interfaces, but misconfiguration could expose admin or cross-role routes.

**Mitigation.**
1. **Role-based access control** enforced at middleware layer (§12.9): recipient, UMKM, and admin routes are isolated; admin routes require elevated role.
2. **Password hashing** (bcrypt/argon2) and session/token management per the stack in §13.
3. **Server-side validation** on all inputs (listing fields, claim actions) — never trust client-side checks; aligns with §7 data validation rules.
4. **Least-privilege DB access** and parameterized queries (per §11 SQL / ORM usage) to prevent injection.
5. **PII minimization**: collect only contact info needed for pickup coordination; do not expose recipient contact to other recipients.
6. **Audit log** of admin actions (approvals, suspensions) for accountability.

**Contingency.** If a breach or exposure is detected: rotate credentials, invalidate sessions, notify affected users, and document the incident. For the academic pilot, a full security audit is out of scope but a **pre-launch checklist** (auth, input validation, route guards) is mandatory.

## 13.3 Risk Summary Matrix

| ID | Risk | Category | Likelihood | Impact | Exposure | Owner |
|---|---|---|---|---|---|---|
| R-01 | Food safety liability | Business/Legal | Medium | High | **High** | Product Lead |
| R-02 | Low supply / cold start | Market | High | High | **Critical** | Product Lead + Growth |
| R-03 | Recipient trust / no-show | Market/Ops | Medium | Medium | Medium | Ops Lead |
| R-04 | Timeline compression | Timeline | Medium | High | **High** | Project Lead |
| R-05 | Survey sample bias | Research | High | Medium | Medium | Research Lead |
| R-06 | Privacy & security | Technical | Medium | Medium | Medium | Tech Lead |

## 13.4 Review Cadence & Escalation

- **Weekly** risk review during sprint checkpoints (§17); update Likelihood/Impact based on new evidence.
- **Escalation**: any risk that moves to High × High, or any R-01 incident, escalates to the project lead and faculty advisor within 48 hours.
- **Closure criteria**: a risk is closed when its mitigation is demonstrably in production (e.g., R-01 T&C + report flow live and tested) and pilot data shows the exposure has not materialized.

# Appendix

Appendix  This appendix provides supporting reference material for the SIPANA PRD: a glossary of domain-specific terms, document references, competitive/contextual analysis notes, a traceability index linking requirements to source sections, and links to supporting materials. It is intended to let any new stakeholder (engineer, designer, QA, advisor) orient themselves without re-reading the full source document.  A.1 Glossary of Domain-Specific Terms  Term   Definition    SIPANA   Sistem Informasi Pangan Berlebih  — "Surplus Food Information System." The web platform described in this PRD.    UMKM   Usaha Mikro, Kecil, dan Menengah  — Micro, Small, and Medium Enterprises. In SIPANA, specifically  UMKM kuliner  (culinary MSMEs) that act as food  givers .    Pangan berlebih / sisa dagangan   Surplus food / unsold daily stock that remains edible and is eligible for distribution.    Pemberi (Giver)   A verified UMKM that publishes surplus food listings.    Penerima (Recipient)   A member of the general public in Karawang who browses and claims listings.    Peruntukan   The  intended-use label  on a listing — either for human consumption or as animal feed ( pakan ternak ). A core food-safety and business rule (§7).    Batas ambil   The  pickup deadline  / consume-by window on a listing, after which the claim auto-expires.    Jam masak   The  cooking/preparation time  recorded on a listing, used by recipients to assess freshness.    Kuota klaim   Claim quota  — the per-recipient limit on simultaneous active claims, enforced to prevent hoarding and no-shows (§7).    Konfirmasi serah terima   Handover confirmation  — the mutual confirmation by giver and recipient that food was collected, producing a completion record.    Verifikasi UMKM   The  admin approval workflow  that validates a UMKM before it can publish listings (FR-002).    Kecamatan   An administrative district in Indonesia. Pilot areas: Karawang Barat, Telukjambe Timur, Karawang Timur.    Kabupaten Karawang   The regency in West Java, Indonesia, that defines the platform's geographic scope.    Cold start   The marketplace problem where a platform lacks supply (listings) and/or demand (recipients) at launch, reducing its value to both sides.    MoSCoW   Prioritization framework:  Must Have, Should Have, Could Have, Won't Have  — used for feature prioritization (§6).    FR / NFR   Functional Requirement / Non-Functional Requirement.    ERD   Entity Relationship Diagram — the data model (§10).    RBAC   Role-Based Access Control — restricts routes/actions by user role (recipient, UMKM, admin).    PII   Personally Identifiable Information — names, contact numbers, locations.    No-show   A recipient who claims a listing but fails to collect it within  batas_ambil .    Black-box testing   Testing based on inputs/outputs without knowledge of internal implementation (§15).     A.2 Document References  Ref   Document / Section   Purpose    [SRC]   SIPANA: Dokumen Desain Sistem  (source design document)   Primary authoritative reference for all requirements in this PRD.    [SRC §2]   Rekap Data Survei   Survey findings (n=25) underpinning design decisions.    [SRC §6]   Kebutuhan Fungsional dan Non-Fungsional   Origin of FR/NFR requirements.    [SRC §7]   Aturan Bisnis   Business rules (claim quota, peruntukan, expiry).    [SRC §8]   Use Case Diagram dan Spesifikasi   Use case definitions.    [SRC §10]   ERD   Data model.    [SRC §11]   Skrip Database (SQL)   Reference schema for persistence layer.    [SRC §12]   Rancangan Antarmuka & Design System   UI/UX, design tokens, two-interface spec.    [SRC §13]   Arsitektur Teknologi   Full-stack technology decisions.    [SRC §14]   Indikator Keberhasilan   Success indicators and logged data.    [SRC §15]   Skenario Pengujian (Black-Box)   Test scenarios.    [SRC §17]   Rencana Kerja sampai November   Work plan and milestones.     A.3 Competitive & Contextual Analysis Notes  Note:  The source document does not include a formal competitive analysis. The following notes are  contextual observations drawn from the source  and general domain knowledge, and should be treated as  recommendations for further research  rather than confirmed requirements.   Existing behavior is informal, not absent.  Survey data (§2.2) shows 91% of UMKM already distribute surplus informally (to neighbors, employees, or the needy). SIPANA's competitor is therefore  the status quo , not another app. The product must beat "just give it to the neighbor" on  reach  and  structure  while matching it on  speed and zero effort  — which is why "posting cepat" is the top-priority feature.   WhatsApp is the incumbent channel.  Free-text UMKM suggestions repeatedly reference WhatsApp ("link ke WA", "chat ke WA"). SIPANA should  integrate with  rather than replace WhatsApp — deep-link sharing is a mitigation for cold-start (R-02) and a UX expectation.   Food-rescue apps exist in other markets  (surplus-food marketplaces), but typically involve  paid discounted  transactions. SIPANA is deliberately  free  and  safety-first  (verification, peruntukan labels, reporting) — a positioning more aligned with a community/social-good service than a commercial marketplace. This distinction should inform tone, branding, and the non-commercial T&C.   Geographic concentration is an asset for the pilot.  Restricting to three kecamatan (§1) concentrates supply and demand, making the marketplace feel active and enabling hyper-local pickup logistics (no delivery, per out-of-scope).    A.4 Requirement Traceability Index  A compact cross-reference so reviewers can trace any requirement back to its source and forward to its tests.  Requirement Area   FR IDs   Source Ref   Test Ref    UMKM registration & verification   FR-002   [SRC §6, §7]   [SRC §15]    Fast listing ("posting cepat")   FR-005   [SRC §2.2, §6]   [SRC §15]    Listing food-safety fields (jam masak, batas ambil, peruntukan)   FR-006   [SRC §7]   [SRC §15]    Browse & search listings   FR-007   [SRC §6]   [SRC §15]    Claim with quota   FR-009   [SRC §7]   [SRC §15]    Handover confirmation   FR-010   [SRC §6, §7]   [SRC §15]    T&C acceptance   FR-012   [SRC §7]   [SRC §15]    Report / "Lapor"   FR-014   [SRC §7]   [SRC §15]    Admin approval & moderation   FR-002, FR-014   [SRC §7, §8]   [SRC §15]    Notifications (Should/Could)   —   [SRC §6]   [SRC §15]    Impact reporting (Should/Could)   —   [SRC §14]   [SRC §15]     Traceability note:  FR IDs above correspond to the numbering established in §6 (Functional Requirements). Where a feature is prioritized as Should/Could-Have, it is marked accordingly and may be deferred per R-04 contingency.   A.5 Assumptions & Open Items (Consolidated)  The following are carried forward from earlier sections for quick reference. Items marked  TBD  require clarification before or during the pilot.  ID   Item   Status    A-01   Survey findings (n=25) are directional, not generalizable (§2, R-05).   Confirmed assumption    A-02   Pilot limited to Karawang Barat, Telukjambe Timur, Karawang Timur.   Confirmed scope    A-03   Platform is free; no payments, no delivery, no mobile app.   Confirmed out-of-scope    A-04   UMKM verification is manual admin approval at launch.   Confirmed (FR-002)    A-05   Exact claim quota value (e.g., max N active claims)   TBD  — set in §7 config; validate in pilot    A-06   No-show cooldown duration / penalty policy   TBD  — define before pilot launch    A-07   Notification channel (email vs. in-app vs. WhatsApp) for Should-Have notifications   TBD    A-08   Data retention period for audit logs and PII   TBD  — align with academic/privacy guidance    A-09   Formal legal review of T&C and liability disclaimer   TBD  — recommended before public launch (R-01)     A.6 Supporting Materials & Links  Material   Location / Status    Source design document (primary reference)   sipana_dokumen_desain_sistem.md  (attached)    Survey export (Google Form, 19 Oct 2026)   Referenced in [SRC §2]; raw export held by research team    ERD & SQL schema   [SRC §10–§11]    UI/UX blueprint & design system   [SRC §12]    Figma prototype   To be produced per [SRC §12.9] —  status: planned    Black-box test scenarios   [SRC §15]    Mermaid diagrams (use case, activity, ERD)   [SRC §8–§10]; render via mermaid.live     A.7 Document Control  Field   Value    Document type   Standard Product Requirements Document (PRD)    Product   SIPANA — Sistem Informasi Pangan Berlebih    Version   1.0    Status   Draft for stakeholder review    Owner   Kelompok 6, Informatika, Universitas Singaperbangsa Karawang    Advisor   Rini Mayasari, S.Kom., M.Kom.    Primary source   SIPANA: Dokumen Desain Sistem    Language   English (source in Bahasa Indonesia)     Change management:  Any change to scope, business rules, or the data model after schema freeze (per R-04) must be logged here with date, author, and rationale, and reflected in the affected source sections before implementation.    
