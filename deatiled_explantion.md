# Auxilia - Detailed Project Explanation

## 1. What Auxilia Is

Auxilia is an end-to-end parametric income-protection platform for gig workers (especially Q-commerce and food-delivery riders). Instead of traditional claim-heavy insurance workflows, Auxilia uses measurable disruption signals (rain, traffic, road incidents, low-demand conditions) to drive faster and more explainable claim decisions.

At a product level, Auxilia has three connected parts:

- `rider_app` (Flutter): rider onboarding, policy actions, claim actions, status visibility
- `admin_dashboard` (Next.js): insurer/operator control center for riders, policies, claims, triggers, analytics
- `backend` (FastAPI): core decision engine, API surface, trigger processing, fraud logic, payout workflow

Core idea: riders buy weekly protection; disruption signals are monitored continuously; claims are validated with explicit checks; eligible payouts are processed through a fast simulated settlement flow.

## 2. Problem Auxilia Solves

Gig workers face immediate income volatility when disruptions occur. A rider may be available and active, but rain or congestion can reduce order completion and earnings. Traditional insurance is often too slow, too generic, and not tuned to short delivery windows.

Auxilia addresses this by:

- Modeling risk at delivery-zone level
- Using a multi-trigger disruption model, not a single weather metric
- Applying explainable automated claim checks
- Providing near-real-time payout workflow visibility

## 3. System Architecture

### 3.1 Frontend Surfaces

- Rider App (`rider_app`)
  - Rider login/session
  - Onboarding + persona/risk context
  - Policy purchase/renewal
  - Claim submission and tracking
  - Coverage and route-risk visibility

- Admin Dashboard (`admin_dashboard`)
  - Admin auth and protected operations
  - Rider/policy/claim operations
  - Trigger monitoring and claim review
  - KPI and forecast analytics

### 3.2 Backend Service

The FastAPI backend exposes APIs under `/api/v1` for:

- `auth`, `riders`, `policies`, `claims`, `payments`, `triggers`, `zones`, `dashboard`, `weather`

It coordinates:

- Policy and claims state transitions
- Trigger checks and history capture
- Fraud/eligibility checks
- Payout orchestration/simulation
- Analytics and forecasting endpoints

### 3.3 Data Layer

Runtime uses PostgreSQL in the deployed setup (SQLite also supported in local/dev scenarios). Data includes riders, zones, policies, claims, triggers, and payout records.

### 3.4 External Integrations

- Weather and disruption signal providers (e.g., OpenWeather, traffic/news inputs)
- Razorpay-compatible payment/payout flow interfaces (simulated in demo path)

## 4. Core Domain Model

### 4.1 Rider

Represents a worker account with persona and operational context. Riders can hold active weekly policies and submit claims.

### 4.2 Zone

A key design unit. Auxilia is zone-first, so risk and trigger logic are mapped to specific zones rather than city-wide averages.

### 4.3 Policy

Weekly protection contract tied to rider + zone + persona, with premium logic influenced by risk signals.

### 4.4 Trigger

Represents measurable disruption evidence (rain, traffic, road incidents, demand context) evaluated against thresholds.

### 4.5 Claim

Claim requests are evaluated against policy validity, trigger evidence, and fraud/behavior checks before final decision.

### 4.6 Payout

For eligible claims, payout is initiated through simulated instant-settlement workflow with auditable status transitions.

## 5. End-to-End Product Flow

## 5.1 Rider Journey

1. Rider signs in and completes onboarding context.
2. Rider views quote and purchases weekly policy.
3. Rider monitors active coverage status.
4. When disruption occurs, rider submits claim.
5. Rider tracks claim and payout progression in app.

## 5.2 Admin/Insurer Journey

1. Admin monitors portfolio KPIs and active triggers.
2. Admin reviews riders, policies, and claim queues.
3. System auto-processes claims with evidence/fraud checks.
4. Admin can intervene for flagged/manual-review cases.
5. Portfolio impact is tracked via analytics and forecasting.

## 5.3 Automated Decision Loop

1. Trigger check runs and updates disruption state.
2. Claim enters processing pipeline.
3. Eligibility and fraud validations execute.
4. Decision is produced (approve/reject/manual review).
5. Approved claims move to payout workflow.
6. Rider + admin interfaces reflect final state.

## 6. AI and Automation Layers

Auxilia uses practical, explainable automation rather than opaque scoring only.

- Risk and pricing intelligence:
  - Supports premium logic based on rider/zone/disruption context
- Fraud and eligibility checks:
  - Trigger evidence alignment
  - Duplicate/frequency and behavior pattern checks
  - Zone/location consistency checks
- Predictive analytics:
  - Next-week likely claims endpoint for operator planning

The goal is decision speed plus trust: quick outcomes with inspectable evidence.

## 7. Admin Dashboard Capabilities

The admin dashboard is an operations console, not just reporting UI.

- Dashboard: live KPIs, claim and coverage summaries
- Riders: rider list and operational context
- Policies: policy lifecycle and stats
- Claims: claim list, details, review actions
- Triggers: current disruptions and signal state
- Analytics: portfolio metrics and predictive indicators

Recent hardening also improved UX reliability:

- Better loading states during route/data transitions
- Partial rendering when one API call fails
- Clear error messaging instead of silent empty screens
- Auth proxy stabilization for hosted deployment

## 8. Rider App Capabilities

The rider app focuses on clarity and speed for workers:

- Guided onboarding and authentication
- Policy view and renewal flow
- Claim submission and claim status timeline
- Home dashboards for protection context
- Mobile-first interaction model for field use

Branding assets and splash behavior were updated to align with Auxilia identity across web and mobile.

## 9. Security and Auth Model

Role-aware authentication is used for admin and rider paths.

- Admin dashboard uses secure token handling via cookie and proxy-backed API access
- Backend authorization supports token extraction from bearer header and cookie fallback where needed for reliability
- Protected routes ensure operational pages and APIs require valid role context

## 10. Deployment and Hosting

Current production structure:

- Admin frontend hosted on Vercel (`https://auxilia.sabarixr.me`)
- Backend hosted on VM behind Nginx with TLS (`https://auxila-api.sabarixr.me`)
- Containerized runtime with Docker + Compose style operations
- Automated image workflow and infra update path integrated in repo workflows

Deployment work included:

- CI/CD auth fixes
- Backend image publishing
- VM container orchestration and service stabilization
- Nginx reverse proxy and HTTPS setup
- Environment sync and database seeding/reset operations

## 11. Why the Design Is Strong for This Use Case

- Zone-first: better reflects real delivery conditions
- Multi-trigger model: avoids overfitting to rain-only logic
- Weekly policy cadence: matches gig earning cycles
- Explainable decisions: easier trust and operations governance
- Dual visibility: rider confidence + insurer controls in one stack

## 12. Demonstration Readiness

The project is demo-ready for the required hackathon scenario:

- You can simulate disruption events through trigger check endpoints
- You can demonstrate claim creation and AI-backed decision path
- You can show payout outcome/state transition
- You can present both rider and admin views with live data

This supports a complete 5-minute walkthrough from trigger -> claim -> payout.

## 13. Current Scope and Practical Constraints

What Auxilia intentionally focuses on:

- Income disruption protection for delivery workers
- Parametric signal-based validation and fast claims flow

What it does not claim in this repository:

- Full regulated insurance issuance stack
- Production-grade banking settlement guarantees
- Complete SOC/compliance framework

The repo is built as a strong, realistic product prototype with deployable architecture and demonstrable end-to-end workflows.

## 14. Quick Reference

- Main overview: `README.md`
- Architecture: `docs/ARCHITECTURE.md`
- Features: `docs/FEATURES.md`
- API map: `docs/API.md`
- Setup: `docs/SETUP.md`
- Environment config: `docs/ENVIRONMENT.md`
- Deployment notes: `docs/DEPLOYMENT.md`
