# Auxilia Final Demo Video Script (5 Minutes) - Final

This is the final, judge-facing script for a single-take screen recording.

It is optimized to meet all required criteria while still sounding natural and professional.

---

## Pre-Recording Setup

Keep these windows prepared:

- Tab 1: `https://auxilia.sabarixr.me` (gateway page)
- Tab 2: Admin dashboard pages: `/dashboard`, `/triggers`, `/claims`, `/analytics`
- Tab 3: Backend Swagger `https://auxila-api.sabarixr.me/docs` or terminal
- Mobile emulator/device: Rider App logged in with active policy

Zoom and readability:

- Browser: `110%` to `125%`
- Terminal font: `16+`
- Device text readable in 1080p recording

Seeded accounts:

- Admin: `admin` / `auxilia123`
- Rider: `+919876543200` / `rider123`

Before pressing record:

1. Hard-refresh dashboard once
2. Close unused tabs/apps
3. Run one warm-up trigger check so first live call is not cold

---

## 0:00 - 0:25 | The Real Problem, Fast

**Screen:** Gateway page with both cards visible

**Say:**

"A delivery rider in Bangalore makes maybe 600 rupees on a good day. When it rains, they can make almost nothing. Traditional insurance takes days, needs paperwork, and often fails at the exact moment workers need support. We built Auxilia to fix that with parametric income protection that processes disruption-driven claims automatically."

---

## 0:25 - 0:55 | Two Interfaces, One System

**Screen:** Point to rider card -> briefly show Rider App home -> return and enter admin side

**Say:**

"Auxilia has two connected interfaces. Riders use the mobile app for onboarding, policy visibility, claim submission, and payout tracking. Operators use the admin dashboard for trigger monitoring, claim decisions, fraud review, and portfolio analytics. One backend powers both views in sync."

---

## 0:55 - 1:25 | Live Data, Not a Mock

**Screen:** Login -> `/dashboard` -> move slowly across KPI cards -> show charts/sections

**Say:**

"This dashboard is reading live backend state right now: active riders, policy coverage, claim pressure, and payout exposure. Nothing on this page is hardcoded. I want to establish that before we simulate an event."

---

## 1:25 - 2:05 | Simulated External Disruption (Required)

**Screen:** Open Swagger or terminal -> run trigger check -> show response -> go to `/triggers` and refresh

Swagger action:

- `POST /api/v1/triggers/check`

Terminal backup:

```bash
curl -X POST "https://auxila-api.sabarixr.me/api/v1/triggers/check"
```

**Say:**

"Now I am firing a trigger check. This calls our disruption pipeline, evaluates live zone signals against thresholds, and marks active disruptions. Here in the response you can see the zone state update and trigger activation. This machine-readable disruption signal drives claim eligibility downstream."

---

## 2:05 - 2:45 | Rider Submits Claim

**Screen:** Rider App -> active policy view -> claim submission -> show pending/processing status

**Say:**

"On the rider side, coverage is visible and claim submission is immediate. I am submitting a claim now tied to the disruption context. No paperwork, no manual call center loop. The claim enters processing within seconds."

---

## 2:45 - 3:40 | AI Claim Decision (Required)

**Screen:** Back to admin `/claims` -> open new claim -> highlight status, zone match, trigger evidence, fraud checks, timestamps

**Say:**

"Here is the same claim in admin operations. Auxilia has run eligibility and fraud validations: zone match, policy validity window, trigger evidence alignment, and duplicate frequency checks. You can inspect the evidence fields directly. This is not a black-box score; every decision has an audit trail. This claim clears the checks and is approved."

If rejected:

"If a claim is rejected in this run, that is still correct behavior and shows the guardrails are working as designed."

---

## 3:40 - 4:35 | Payout Workflow (Required)

**Screen:** Claim/payout panel -> show status transition -> amount + reference -> optional rider app sync view

**Say:**

"Approved claims move directly into payout orchestration: initiated, processing, and settled. In this demo environment settlement is simulated, but the workflow is fully real with status transitions and transaction references. The rider side updates in sync. From trigger to payout, the whole loop just ran."

---

## 4:35 - 5:00 | Close Strong with Portfolio Impact

**Screen:** `/analytics` -> point to protected earnings, coverage, loss ratio, forecast -> end on clean frame

**Say:**

"Analytics gives operators portfolio visibility: earnings protected, coverage depth, loss ratio, and forward risk projection. That is Auxilia: live disruption signals, explainable automated claim decisions, and fast payout outcomes built for gig workers who currently operate without a reliable safety net. Thank you."

---

## Backup Lines (If Live Demo Delays)

If trigger response is slow:

"Trigger check is asynchronous, I will refresh once to sync the latest zone state."

If claim is still processing:

"While status finalizes, the evidence fields are already attached and visible from the processing pipeline."

If payout is pending:

"Payout simulation is in queue within the same workflow; I will refresh once before closing."

---

## Final Submission Checklist

- Public link, no login needed for viewers
- Video length close to 5 minutes
- Explicitly visible disruption simulation
- Explicitly visible AI claim decision evidence
- Explicitly visible payout state/outcome
- Clear narration of full end-to-end platform
