# Product Requirements Document

**Product:** Strata *(working name — final brand name in progress, see Section 16)*
**Category:** Personal credit card strategy platform
**Document status:** Living document, reflects the build as of commit `528d166` (Oct 8, 2026) plus the Phase 2/3 roadmap
**Last updated:** October 8, 2026
**Owner:** Sriram Kakumanu
**Contributors:** Sriram Kakumanu (product, engine, docs), RayhanXD (UI redesign, Supabase auth and persistence)

> **Revision note (Oct 8, 2026):** The original MVP (Sept 29) was client-only with no accounts. Commit `528d166` added real accounts and a Supabase backend, a database-backed card catalog, a full UI redesign, and the first automated tests. Sections 4, 7, 9, 10, 11, 12, 14, 15 and 16 were updated to match. The recommendation engine itself (`src/lib/engine/*`) was not changed by that commit.

---

## 1. Overview & Vision

Strata is a personalized credit card strategist. It analyzes a user's credit profile, existing cards, spending habits, issuer relationships, and stated goals, then produces a structured, explainable recommendation for what card to get next, why, and what the path looks like to reach an aspirational card (e.g., "I eventually want the Capital One Venture X").

**Vision statement:** *"Tell us where you are financially and where you want to go, and we'll build the optimal credit-card path to get you there."*

**Core differentiator:** Every other product in this space (NerdWallet, WalletHub, The Points Guy, issuer comparison pages) is a static, generic best-of list. Strata is the first product to treat credit-card selection as a multi-step financial strategy problem, personalized to one user's real profile, with every recommendation traceable to a visible reason — never a black box, never a guarantee of approval.

---

## 2. Problem Statement

Consumers researching credit cards today face three failures in the existing market:

1. **Genericness.** Comparison sites rank cards the same way for every visitor, ignoring the cards a user already owns, their actual spending, or their credit profile.
2. **No path.** A user who wants a specific aspirational card (Venture X, Amex Platinum) gets told to "just apply," with no guidance on whether they're positioned to succeed, or what to do first if they aren't.
3. **Opacity and risk.** Existing tools either overstate approval odds (implying guarantees they can't back) or bury users in disclaimers with no actionable structure. Users can't tell if a recommendation fits their financial life or is just the highest-affiliate-payout card.

Strata solves this with a structured, transparent recommendation engine that treats "what card should I get" as a function of a real, multi-dimensional financial profile, and separates "what the engine recommends" from "how it's explained" so the explanation can never drift from or override the underlying logic.

---

## 3. Goals & Success Metrics

### MVP goals (this build)
| Goal | Success criteria | Status |
|---|---|---|
| Personalized engine, not a static list | Different user profiles produce materially different top recommendations with distinct, visible reasoning | ✅ Met — verified live across 5 demo personas |
| Card Journey to a target card | A user with an aspirational goal card gets a multi-step path (not just "apply now"), with a non-guaranteed readiness score | ✅ Met — verified live (SavorOne → build → reassess → Venture X, 49% readiness) |
| Full working MVP, not a mockup | Onboarding through 9+ functional app pages, real interactions, no dead ends | ✅ Met — 22 route files (incl. auth), full onboarding, builds/lints clean as of the Sept 30 MVP; re-verify after `528d166` |
| Real accounts and persistence | Users can sign up, log in, and have their profile persist server-side | 🟡 Built (Supabase auth + `profiles` table with row-level security), not yet verified end-to-end by me; email verification is currently bypassed (see Section 12) |
| Financial safety by construction | No claim of guaranteed approval anywhere in the product | ✅ Met — audited, only negated claims found ("not a guarantee") |
| Legal/compliance baseline | Privacy, Terms, Cookie, Refund policies; consent banner; accessibility baseline | ✅ Met — see Section 12 |

### Phase 2 success metrics (post-MVP, requires real users/backend)
- **Activation:** % of users who complete onboarding (target: >60%)
- **Recommendation trust:** % of users who view "Why this recommendation?" at least once per session (proxy for engine transparency landing)
- **Journey engagement:** % of users with a target-card goal who return to check readiness again within 90 days
- **Card Advisor usage:** average questions per active user per month
- **Outcome tracking (requires bureau integration):** % of users whose self-reported credit health metric improves over a 6-month window
- **Retention:** % of users who return for their "next review date" prompt

---

## 4. Non-Goals (explicitly out of scope for the current build)

*Moved out of this list as of `528d166`: user accounts, authentication, and server-side persistence now exist (Section 7.11).*

- Real credit bureau integration (soft-pull scores, live reports) — architecture is stubbed, not connected
- Real LLM-powered conversational advisor — Card Advisor is rule-based intent-matching against structured data, by deliberate choice (avoids API cost/key handling and hallucination risk for an MVP)
- Payments, subscriptions, or any monetization — no billing exists; Refund Policy is written forward-looking for when it does
- Email verification and branded transactional email — signup currently auto-confirms the email address via a database trigger (first-pass shortcut; see Section 12)
- Financial account aggregation (Plaid-style bank linking) or automatic spending import
- Push/email notification delivery — notification preferences are now saved to the user's profile, but notifications are still only computed and displayed in-app, nothing is sent externally
- Mobile native apps — responsive web only
- Multi-language / i18n support
- Real issuer application submission — Strata only links out to the issuer's own site

---

## 5. Target Users & Personas

Strata is built around five illustrative personas (shipped as live, switchable demo profiles in the MVP), each representing a distinct segment:

### Persona 1 — Maya Chen, "The First-Timer"
No credit history, no cards, employed full-time, age 21–24. Goal: build credit from zero. **Needs:** an accessible starter card recommendation, plain-language credit education, zero intimidation.

### Persona 2 — Jordan Patel, "The Aspirational Student"
Student, one entry-level card (Discover it Student), fair credit (~660), explicit long-term goal of the Capital One Venture X. **Needs:** the Card Journey feature — an honest "not yet, here's the path" experience rather than false encouragement or a flat no.

### Persona 3 — Priya Nair, "The Cashback Optimizer"
Established credit (very good, ~760), two flat-rate cashback cards, high grocery/dining spend. Goal: maximize cashback, no interest in travel. **Needs:** category-level reward-rate comparison, low tolerance for annual fees.

### Persona 4 — Daniel Osei, "The Frequent Traveler"
Excellent credit (~800), three cards already (Sapphire Preferred, Freedom Unlimited, Amex Gold), high travel spend, high fee tolerance. Goal: premium travel benefits, lounge access. **Needs:** ecosystem-level analysis (which issuer's transfer partners fit his actual travel patterns), upgrade-path reasoning (Sapphire Preferred → Reserve).

### Persona 5 — Samuel Ortiz, "The Portfolio Holder"
Excellent credit (~815), five cards already, self-employed, high income. Goal: consolidate and optimize, not acquire. **Needs:** the Optimize My Wallet feature — overlap detection, fee-efficiency review, not more recommendations.

---

## 6. Core User Journeys

### 6.1 Sign up and onboarding (first-time user)
0. **Account** — a visitor signs up (`/signup`) or logs in (`/login`); `/forgot-password` and `/reset-password` handle recovery. A request-level proxy redirects signed-out visitors away from app pages and sends signed-in users who haven't finished onboarding to `/onboarding`.
1. **Welcome** — value proposition, single CTA ("Build My Strategy"), plus demo-profile shortcuts for evaluation (shown only when `NEXT_PUBLIC_ENABLE_DEMO_PROFILES` is not `false`; hidden on production).
2. **Financial Profile** — name, age range, employment status, income (slider), housing status/payment, annual fee tolerance.
3. **Credit Profile** — credit score band, utilization band, number of open accounts, credit age, recent applications/inquiries, existing loans.
4. **Banking & Brand Relationships** — multi-select issuer relationships (checking/savings/investment) across 8 major issuers.
5. **Existing Cards** — search/autocomplete to add owned cards with months-open, skippable.
6. **Spending Habits** — category sliders (dining, groceries, gas, travel, online, other), auto-totaled.
7. **Goals** — multi-select, priority-ordered by click order, with target-card search if "work toward a specific card" is selected.
8. **Travel Preferences** — *conditionally shown* only if a travel-related goal was selected (progressive disclosure); home airport, favorite airlines/hotels, frequency, scope, cabin.
9. **Complete** — instant strategy preview (Credit Health score, recommended next card, primary goal, narrative summary) before entering the full app.

**Acceptance criteria:** Wizard must skip the Travel step entirely when irrelevant; all fields must persist across Back navigation; completing onboarding saves a fully-formed profile to the user's account and routes to Dashboard; a returning signed-in user who already finished onboarding is redirected away from `/onboarding` to `/dashboard`.

### 6.2 The Card Journey (target-card goal)
Given a user with a `target_card` goal:
1. Engine computes a **Readiness Assessment** (0–100%) across six weighted components: credit profile, account age, recent inquiries, existing issuer relationship, income, current portfolio.
2. If readiness ≥ 72%: journey collapses to a single "you're well-positioned" step pointing at the target card.
3. If readiness < 72%: journey generates a 4-step path — (1) a stepping-stone card from the same issuer with a lower eligibility bar, chosen via the scoring engine; (2) a "build your profile" guidance step (no card); (3) a "reassess" checkpoint step (no card); (4) the target card itself, labeled "potential next move," carrying the readiness summary.

**Acceptance criteria:** Journey must never state or imply guaranteed approval. Every step must carry at least one visible reason where applicable. The readiness component with the weakest status must be surfaced in the summary narrative.

### 6.3 Optimize My Wallet (existing multi-card holder)
1. User's owned cards are analyzed pairwise for reward-category overlap (two+ cards earning ≥2x in the same category).
2. User's stated spending is cross-referenced against owned cards to detect uncovered categories (≥$150/mo in a category with no card earning ≥2x there).
3. Owned cards with annual fee > $0 and negative estimated net value are flagged for fee review.
4. Cards with lounge/travel benefits are flagged as possibly unused if travel spend is low.

**Acceptance criteria:** Each insight must name the specific cards involved and propose a concrete action (e.g., "route dining spend to Card X").

### 6.4 Ask Card Advisor (any user, any page)
1. User asks a natural-language question via the floating widget or the dedicated `/advisor` page.
2. Question is intent-matched (not sent to an LLM) against ~10 categories: readiness/"should I get X," "what's next," transfer partners, cancel/product-change, "how many cards," cashback-vs-travel, "why isn't my score improving," hard-inquiry education, ecosystem summary.
3. Answer is generated from the same structured engine outputs used elsewhere in the app (readiness, scoring, portfolio optimizer, credit health), never invented.
4. Unmatched questions receive an honest "I don't want to guess" fallback with suggested rephrasing.

**Acceptance criteria:** No answer may state or imply an approval probability. No answer may cite a transfer partner, fee, or card term not present in the card database.

---

## 7. Functional Requirements by Feature Area

### 7.1 Dashboard (`/dashboard`)
- Time-of-day greeting with user's first name
- Credit Health score (circular gauge) linking to full breakdown
- Current Strategy card (primary goal label + supporting context)
- Recommended Next Step card linking to score explainability
- Readiness gauge for target-card goal *or* Wallet Value stat if no target-card goal
- "Your Strategy" — first 4 entries of the timeline
- Top Recommendation card (full explainable card, expandable score breakdown)
- Wallet summary (up to 4 owned cards) linking to My Cards
- Persistent financial-safety disclaimer

### 7.2 My Cards (`/cards`)
- Visual card tiles (stylized gradient, issuer-accented, no reproduction of real card art)
- Add-a-card flow via autocomplete + months-open input
- Per-card detail modal: estimated annual value, net-of-fee value, full reward categories, full benefits list, "Worth Keeping" vs "Reconsider" verdict, remove action
- Portfolio summary stats: card count, total estimated annual value, total annual fees
- Link to Optimize My Wallet

### 7.3 My Strategy (`/strategy`)
- Full narrative summary of current strategy
- Full Readiness Breakdown (if target-card goal exists)
- Full Card Journey timeline (if target-card goal exists) *or* top-3 recommendation cards (if not)
- Full N-month strategy timeline (6 milestones: today, +3, +6, +12, +18, +24 months, dynamically generated from the user's actual weakest credit-health metric and top recommendation)

### 7.4 Credit Health (`/credit-health`)
- Overall Credit Health score (0–100 composite, explicitly labeled as an educational proxy, not a real FICO/VantageScore)
- 5 expandable metrics: Payment History, Utilization, Account Age, Recent Inquiries, Credit Mix — each with current value, status, explanation, why-it-matters, how-to-improve, and expected timeframe
- Personalized Improvement Recommendations, prioritized, each with issue/why/action/expected-impact/time-horizon

### 7.5 Card Finder (`/card-finder`, `/card-finder/[cardId]`)
- "Recommended for You" — top 3 scored cards, always shown first
- Filter chips: annual fee tier, category, issuer
- Full searchable list, every card scored against the active profile when available
- Card detail page: full fit-score breakdown, welcome offer, rewards, benefits, transfer partners, eligibility considerations, data-freshness disclosure, hard-inquiry warning, outbound application link, "I have this card" quick-add

### 7.6 Travel Rewards (`/travel`)
- Travel profile summary (home airport, favorites, frequency, scope, cabin)
- "Your strongest ecosystem" — issuer ranked by owned cards + banking relationships + transfer-partner overlap with stated favorite airlines/hotels + goal alignment
- Full transfer-partner grid (airlines, hotels), favorites highlighted
- Quick-ask shortcuts into Card Advisor for common travel questions

### 7.7 Card Advisor (`/advisor`, global widget)
- Full-page chat and floating widget, same underlying logic
- Suggested-question chips on first load
- Deep-link support via `?q=` query param (used by Travel Rewards quick-asks)
- Every response distinguishes personalized guidance from general education

### 7.8 Resources (`/resources`)
- Credit bureau contact info (Equifax, Experian, TransUnion)
- Card issuer contact info (8 issuers: customer service, lost/stolen)
- Other resources (AnnualCreditReport.com, CFPB complaint portal)
- Legal policy links

### 7.9 Settings (`/settings`)
- Editable profile fields (name, income, annual fee tolerance)
- Theme toggle (light/dark, persisted)
- Notification preference toggles (saved to the user's profile in the database; not yet wired to real delivery)
- Demo profile switcher (only when demo profiles are enabled)
- Data & Privacy: reset profile (destructive, confirmed via modal) and **self-serve account deletion** (server action deletes the auth user; the profile row cascades)
- Legal policy links

### 7.10 Legal & Marketing Pages
- Landing page (`/`) — hero, comparison section, sample journey, readiness teaser, advisor teaser, issuer logos, end CTA
- Privacy Policy, Terms of Service, Cookie Policy, Refund Policy (`/privacy`, `/terms`, `/cookies`, `/refund-policy`) — business identity (operator name, support email, jurisdiction, address) is now read from environment variables via `src/lib/site.ts`, with generic defaults
- Cookie/local-storage consent banner (site-wide, dismissal persisted)
- Onboarding consent line linking to Terms/Privacy

### 7.11 Accounts & Authentication (added in `528d166`)
- Pages: `/login`, `/signup`, `/forgot-password`, `/reset-password`, plus `/auth/callback` (route handler)
- Supabase Auth with cookie-based sessions (`@supabase/ssr`); a `src/proxy.ts` request proxy refreshes the session and enforces route access
- Public routes: `/`, auth pages, and the four legal pages; everything else requires sign-in, and everything except `/onboarding` additionally requires completed onboarding
- On first login the app loads the user's `profiles` row (creating a blank one if absent) into the client store; edits are saved back with a 400 ms debounce, and card add/remove saves immediately
- Sign-out button and a loading screen while the session/profile/catalog hydrate
- Self-serve account deletion (Section 7.9)
- Card/issuer/transfer-partner catalog is fetched from Supabase at runtime and swapped into the in-memory arrays the engine already imports; if the fetch fails, the bundled TypeScript seed is used so the app never blanks
---

## 8. Recommendation Engine Specification

The engine is the product's core IP. It is **strictly separated from presentation**: `User Data → Recommendation Engine → Structured Recommendation → (optional) Explanation Layer`. No natural-language layer may alter the underlying score or fit label.

### 8.1 Scoring rubric (100 points total, 7 weighted factors)

| Factor | Max points | Computation summary |
|---|---|---|
| Credit Profile Fit | 20 | Compares user's credit-score band against the card's minimum band (2+ bands above = full credit; each band below scales down sharply); penalized 20% if credit age is under the card's stated minimum |
| Goal Alignment | 25 | Weighted average of per-goal fit fractions (priority 1 = 100% weight, priority 2 = 60%, priority 3+ = 40%), computed per goal type (18 goal types supported) |
| Spending Match | 20 | Estimated net annual value from the card's reward structure against the user's actual category spend, scaled against a $250 net-value benchmark |
| Issuer Relationship | 12 | Points for checking (+5)/savings (+3)/investment (+4) banking relationship with the card's issuer, plus (+4) if an existing card from that issuer is already owned |
| Portfolio Compatibility | 10 | Penalizes categories where an owned card already earns ≥2x in the same category; rewards categories the new card would newly cover |
| Timing | 8 | Scaled down based on hard inquiries in the last 6 months (0 = full score, 4+ = zero) |
| Annual Fee Fit | 5 | Full score if $0 fee; otherwise scaled against the user's stated fee-tolerance tier |

**Fit label thresholds:** ≥75 = Strong Fit · 55–74 = Consider · 35–54 = Wait · <35 = Not Recommended Right Now. A hard override forces "Not Recommended Right Now" regardless of total score if the user's credit band is 2+ bands below the card's stated minimum.

### 8.2 Readiness Assessment (target-card specific, separate from the scoring rubric)
Six components, each independently rated Strong/Moderate/Developing/Weak: Credit Profile, Account Age, Recent Inquiries, Existing Issuer Relationship, Income (thresholds scale with the target card's annual fee tier), Current Portfolio (based on number of owned cards). Overall percentage is the average of component scores (Strong=100, Moderate=70, Developing=45, Weak=20).

### 8.3 Estimated Card Value
For each card, monthly reward value is computed per category (percent-style currencies: cashback, Discover Cashback, Wells Fargo Rewards; point-style currencies: Chase UR at 1.25¢, Amex MR at 1.25¢, Capital One Miles at 1.1¢, Citi ThankYou at 1.1¢, U.S. Bank Points at 1.1¢), with the "everything" catch-all category applied only to spend not already claimed by a more specific category on the same card (prevents double-counting). Net annual value = annual reward value − annual fee.

### 8.4 Explainability requirement
Every `CardRecommendation` object must carry: a `ScoreBreakdown` (all 7 factor sub-scores + total), a `reasons[]` array (only populated when the underlying sub-score crosses a defined threshold), and a `cautions[]` array (same). The UI must never show a score without offering access to its breakdown.

---

## 9. Data Model (summary)

Core entities (full TypeScript definitions in `src/lib/types.ts`):
- **UserProfile** — financial profile, spending profile, issuer relationships, owned cards, prioritized goals, travel preferences, onboarding/review metadata, and (new) `notificationPrefs` (renewals, readiness, utilization, reviews)
- **CreditCardProduct** — issuer, network, category tags, annual fee, rewards currency + category rates, welcome offer, benefits, lounge access, travel protections, transfer partner IDs, eligibility guidance, product-change targets, application URL, data-freshness record
- **Issuer** — contact info, application-velocity rules (e.g., Chase 5/24)
- **TransferPartner** — type (airline/hotel), source currencies + ratios
- **CardRecommendation** — score breakdown, fit label, reasons, cautions, estimated annual value
- **CardJourney** — ordered steps, each with timing (now/next/later), optional card reference, reasons
- **ReadinessAssessment** — overall percentage, 6 components with status + explanation
- **CreditHealthSnapshot** — overall score, 5 metrics with value/status/explanation/why/how/timeframe
- **OptimizationInsight** — type (overlap/gap/fee-review/unused-benefit), affected cards, suggested action

**Database (Supabase Postgres, `supabase/migrations/`):** `profiles` (one row per auth user; nested profile fields stored as JSONB; row-level security so users can only select/insert/update/delete their own row; created automatically by a trigger on signup), and `cards`, `issuers`, `transfer_partners` (world-readable via row-level-security select policies; each card stored as a JSONB `product` document). A `delete_own_account()` function supports account deletion.

Seed data currently includes **20 cards across 8 issuers** (Chase, Capital One, American Express, Citi, Discover, Bank of America, Wells Fargo, U.S. Bank), **14 transfer partners**, and **5 demo personas**.

---

## 10. Non-Functional Requirements

### 10.1 Accessibility
- WCAG AA color contrast (4.5:1 minimum for normal text) — verified and corrected for the muted "faint" text token in both themes (light: ~3.6:1 → ~5.6:1; dark: ~4.0:1 → ~4.9:1)
- Skip-to-content link on every layout
- All icon-only interactive elements carry `aria-label`
- Modal components implement a real focus trap (focus enters on open, Tab loops within, focus restores to trigger on close), Escape closes
- No raster images in the product (all iconography is inline SVG via lucide-react), so no alt-text debt
- Keyboard-operable custom controls (radio/checkbox card groups are real `<button>` elements, not divs)
- Reduced-motion respected via `prefers-reduced-motion` media query

### 10.2 Responsive Design
- Desktop: persistent sidebar navigation
- Mobile (<lg breakpoint): bottom tab bar (Overview, Strategy, Cards, Advisor, More) with a bottom-sheet "More" menu for secondary pages
- All onboarding steps and dashboards tested down to 375px width

### 10.3 Theming
- Full light/dark theme support via CSS custom properties, no FOUC (inline script sets `data-theme` before hydration)
- Theme preference persisted in localStorage

### 10.4 Data Privacy (as currently implemented)
- Profiles are stored server-side in Supabase, keyed to the authenticated user and protected by row-level security. Theme and cookie-banner preferences remain in browser localStorage
- The browser uses the Supabase publishable key; the service-role key (optional, used only by the account-deletion server action) must stay server-side and uncommitted (`.env.example` documents the variables; `.env*` is gitignored)
- No PII beyond what's necessary for recommendations is ever requested (explicitly excluded: SSN, full account numbers, full card numbers, passwords)
- Profile reset and self-serve account deletion available in Settings (destructive, confirmed)

### 10.5 Performance
- All routes except the dynamic card-detail page are statically prerendered at build time
- Recommendation scoring runs client-side, on-demand, over a 20-card dataset (sub-millisecond in practice; will need revisiting if the card database grows to thousands of cards per the original spec's ambition)

---

## 11. Technical Architecture

**Current (as of `528d166`):**
- Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- State: zustand store, hydrated from and saved to Supabase per signed-in user
- Backend: Supabase (Postgres, Auth, row-level security), accessed through `@supabase/ssr` / `@supabase/supabase-js`
- Tests: vitest (`npm test`); `personas.test.ts` snapshot-tests top recommendations, Jordan's 49% Venture X readiness, and his journey
- Required env vars: see `.env.example` (Supabase URL, publishable key, optional service-role key; legal-identity variables; demo-profile flag)
- Animation: framer-motion
- Icons: lucide-react (ISC license)
- Fonts: Geist and Geist Mono (Vercel, SIL Open Font License) plus a display face for headings
- No external API calls beyond Supabase; no credit bureau integration
- Node 20.19+ required (`.node-version` pins 22)
- Deployment target: not yet decided (Vercel is the natural fit given the framework)

**Architecture principle carried through every module:** the recommendation engine (`src/lib/engine/*`) has zero dependency on React or the UI layer — every function is a pure function of `(cards, profile) → structured output`, independently testable, and reusable by both the UI pages and the Card Advisor's intent-matching layer.

**Phase 2 additions required (see Section 14):**
- Recommendation history persistence (profiles persist; past recommendations do not)
- Credit bureau integration layer (soft-pull score/report retrieval — architecture should slot in as a new data source behind the existing `FinancialProfile` shape)
- A real card data refresh pipeline (cards now live in a database table, but are still hand-seeded from the same 20-card dataset; the `dataFreshness` model exists but nothing refreshes it)
- Notification delivery (email/push) wired to the existing notification-derivation logic
- Optional LLM explanation layer, strictly downstream of the existing structured engine output (per the architecture principle above — the LLM explains, it does not decide)

---

## 12. Legal & Compliance Requirements

### Implemented in MVP
- Privacy Policy, Terms of Service, Cookie Policy, Refund Policy pages; business identity now comes from env vars with generic defaults (**the default support email `support@strata.app` and address "Address on file" are placeholders, not real; set real values before launch**)
- Cookie/local-storage consent banner
- Onboarding consent checkpoint (Terms/Privacy links before profile creation begins)
- Hard-inquiry warning before every outbound issuer application link
- Persistent "not a guarantee of approval" disclaimer across Dashboard, Strategy, Card Finder, Advisor
- Age-of-majority (18+) requirement stated in Terms
- No collection of SSN, full account/card numbers, or passwords anywhere in the product

### Explicitly NOT yet addressed (real legal review required before any real launch)
- **FCRA (Fair Credit Reporting Act) compliance** — once real bureau data is used, Strata would likely need to operate under FCRA's permissible-purpose and adverse-action framework
- **State-level lending/advisory licensing** — some states regulate "credit repair" or "credit counseling" services distinctly; Strata's positioning as educational guidance (not credit repair) needs explicit legal sign-off
- **Affiliate disclosure requirements (FTC)** — if/when issuer affiliate relationships are monetized, disclosure language must be reviewed against FTC endorsement guidelines
- **Accessibility legal exposure (ADA/Section 508)** — the MVP accessibility work (Section 10.1) is a good-faith engineering baseline, not a legal accessibility audit
- **Data breach notification obligations** — now relevant: a real backend stores user financial-profile data. Needs an incident response plan and breach-notification process before real users
- **Email verification is bypassed** — a database trigger auto-confirms every new account's email at signup (noted in the code as a first-pass shortcut). Anyone can register with an address they don't own; password-reset and any future notifications depend on verified email
- **Privacy Policy accuracy** — the policy was written forward-looking; with Supabase now storing profiles it should be re-read against what the app actually collects and which vendors process it
- **CCPA/state privacy law compliance** — Privacy Policy is a template; real data-subject-request tooling doesn't exist yet

This section should be reviewed with actual counsel before Strata handles a single real user's real financial data.

---

## 13. Analytics & Instrumentation (Phase 2)

Not implemented in MVP (no analytics SDK is integrated by design, see Section 7.10 / Cookie Policy). When added, priority events to track:
- Onboarding step completion/drop-off (per step)
- Recommendation impressions and "Why this recommendation?" expansions
- Card Journey step views
- Card Advisor question volume and unmatched-question rate (signal for expanding intent coverage)
- Outbound issuer application link clicks (post hard-inquiry-warning acknowledgment)
- Optimize My Wallet insight engagement

---

## 14. Phased Roadmap

**Phase 1 — MVP (this build, complete):** Full client-side product per Sections 6–10, 5 demo personas, 20-card database, legal/accessibility baseline.

**Phase 2 — Real Data & Accounts** *(in progress)*:
- ✅ Authentication + user accounts (Supabase Auth)
- ✅ Backend persistence replacing localStorage (Supabase `profiles`, row-level security)
- ✅ Card catalog moved to database tables (seed data only so far)
- ✅ First automated tests (vitest persona snapshots)
- ⬜ Turn off the email auto-confirm trigger; branded SMTP and a custom domain
- ⬜ Credit bureau soft-pull integration
- ⬜ Expanded card database (target: hundreds of cards, sourced and refreshed on a real cadence, using the existing `dataFreshness` model)
- Real notification delivery
- Basic analytics instrumentation

**Phase 3 — Scale & Monetization:**
- Financial account aggregation (automatic spending import, replacing manual category sliders)
- Subscription tier (premium strategy reports, advanced portfolio analysis) — Refund Policy already anticipates this
- Issuer partnership/affiliate program, with disclosure
- Real LLM explanation layer, strictly downstream of the existing engine
- Mobile native app evaluation

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Users over-trust the heuristic scoring/readiness numbers as if they were real approval predictions | High — could lead to real financial harm and reputational/legal exposure | Persistent, non-dismissible framing as "positioning, not guarantee" throughout; Phase 2 should validate the rubric against real approval outcome data before scaling |
| Regulatory exposure once real credit data is handled | High | Legal review required before Phase 2 bureau integration ships (see Section 12) |
| Card database staleness | Medium — a recommendation built on a stale annual fee or discontinued welcome offer actively misleads users | `dataFreshness` field already modeled; Phase 2 needs a real refresh pipeline, not manual edits |
| Recommendation engine biased toward known issuers due to seed-data coverage gaps | Medium | Expand card database breadth before Phase 2 launch; audit for issuer coverage parity |
| Test coverage is thin | Medium — only persona snapshot tests exist; `personas.test.ts` locks current outputs, including that Maya (no credit history) gets top results (Freedom Unlimited, Freedom Flex) labeled "Not Recommended Right Now" because ranking sorts by total score, not by fit label | Decide whether that ranking is intended; if not, rank eligible cards first and update the snapshot. Add unit tests per engine module |
| Email auto-confirm and placeholder support email shipped in the current build | Medium — unverified accounts; policy pages list a support address that may not exist | Turn off the trigger and set real `NEXT_PUBLIC_SUPPORT_EMAIL` etc. before inviting real users |

---

## 16. Open Questions / Decisions Needed

1. **Final brand name** — in progress as of this document's writing; "Strata" is a working name only. See naming-research thread for evaluated candidates (Farol, Credo, Nota, Fonte, etc.) and rejected options with documented conflicts.
2. **Legal entity formation** — Privacy/Terms/Cookie/Refund policies now read operator name, support email, jurisdiction and address from environment variables (`src/lib/site.ts`), defaulting to the brand name, `support@strata.app`, "the United States" and "Address on file" until a real entity exists.
3. **Which credit bureau(s) to integrate first** — Equifax, Experian, TransUnion, or an aggregator (e.g., a soft-pull API vendor)?
4. **Monetization model** — subscription (Refund Policy assumes this), affiliate revenue, or both? Affects disclosure requirements and the "never let monetization bias recommendations" principle from the original product spec.
5. **Hosting and environments** — where to deploy (Vercel is the natural fit), which Supabase project is production vs. preview, and who holds the service-role key.
6. **Card database sourcing strategy for Phase 2** — build an internal data-entry pipeline, license a third-party card database API, or both?

---

## Appendix A — MVP Feature Checklist Against Original Product Spec

For full traceability, every feature area in this PRD maps to a numbered section in the original 41-section product specification supplied at project kickoff. All "Must Have" MVP items from that spec's Section 33 are implemented; all Phase 2 items from that spec are carried forward unchanged into Section 14 of this document.
