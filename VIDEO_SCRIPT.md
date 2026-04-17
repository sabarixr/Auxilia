# Auxilia 5-Minute Demo Script

This script is designed for a **single-take 5-minute screen recording** that demonstrates the complete flow:

1. Simulated external disruption
2. Automated AI claim validation
3. Automated payout outcome

Use this as the narration + click path for your final submission video.

## Demo Goal

Show that Auxilia is not a static dashboard: it is a working parametric protection system where zone-level disruptions trigger AI-assisted claims and payout processing.

## Recording Setup (Before You Start)

- Keep these tabs/windows ready:
  - Admin dashboard (`/triggers`, `/claims`, `/analytics`)
  - Rider app (logged in with seeded rider)
  - API docs (`/docs`) or terminal for trigger check call
- Use seeded credentials:
  - Admin: `admin` / `auxilia123`
  - Rider: `+919876543200` / `rider123`
- Ensure backend is running and reachable.

## Reliability Prep (Important)

To guarantee a visible trigger during recording, temporarily use a low rain threshold in demo env.

Example (demo-only):

```env
RAIN_THRESHOLD_MM=0.1
```

Then restart backend and run one trigger check before recording.

This creates a deterministic "simulated disruption" moment even if live weather is calm.

## 5-Minute Timeline (Screen Capture)

## 0:00 - 0:35 | Intro + Problem

Narration:

"This is Auxilia, an AI-powered parametric income-protection platform for gig workers. It protects weekly earnings when disruptions like rain, traffic, road incidents, or demand collapse reduce delivery income."

On screen:

- Open `README.md` briefly.
- Show production links:
  - dashboard
  - backend API

## 0:35 - 1:20 | Architecture + Why It Is Different

Narration:

"Auxilia is zone-first, not city-average. Each zone is monitored independently, and claims are validated using multi-signal checks and fraud controls before payout automation."

On screen:

- Open `docs/ARCHITECTURE.md`.
- Scroll through:
  - High-Level Diagram
  - Product Flow Diagram

## 1:20 - 2:10 | Simulate External Disruption

Narration:

"Now I will simulate an external disruption and trigger a fresh signal check across zones."

On screen (choose one):

- **Option A (Swagger/UI):**
  - Open `/docs`
  - Execute `POST /api/v1/triggers/check`
- **Option B (Terminal):**

```bash
curl -X POST "https://auxila-api.sabarixr.me/api/v1/triggers/check"
```

Then show evidence:

- Admin `Triggers` page with active trigger count
- Optional: `GET /api/v1/triggers/history` to show new event entries

## 2:10 - 3:10 | Rider Claim Submission

Narration:

"With a live disruption active, the rider submits a claim against an active weekly policy."

On screen:

- Open Rider app dashboard
- Show active policy card
- Submit claim (use matching trigger type)
- Show claim status moving to `pending` / `processing`

## 3:10 - 4:20 | AI Validation + Admin Visibility

Narration:

"Auxilia runs automated fraud and eligibility checks in the background, including zone alignment, trigger evidence, duplicate/frequency checks, and behavior checks."

On screen:

- Open admin `Claims` page
- Open the submitted claim detail
- Highlight:
  - fraud score
  - claim decision/status progression
  - trigger values vs threshold

If manual review appears, explicitly show approve/reject action and explain why.

## 4:20 - 5:00 | Payout Proof + Closing

Narration:

"Eligible claims move to payout simulation, and both rider and insurer views update in near real-time."

On screen:

- Show claim status as approved/paid
- Show payout amount
- Show payout log (public or admin view) including transaction hash/reference
- End on analytics/KPI cards (`earnings protected`, `active weekly coverage`, `loss ratio`, `next-week likely claims`)

Closing line:

"That is the full parametric loop in Auxilia: disruption signal, AI validation, and payout outcome in one integrated workflow."

## Backup Plan (If Trigger Not Active During Recording)

- Re-run trigger check once:

```bash
curl -X POST "https://auxila-api.sabarixr.me/api/v1/triggers/check"
```

- Refresh admin Triggers page.
- If still inactive, use demo threshold override (`RAIN_THRESHOLD_MM=0.1`) and retry.

## Deliverable Checklist

- 5-minute video, publicly accessible link
- Includes visible simulated disruption event
- Includes rider claim submission
- Includes AI-driven claim processing evidence
- Includes payout outcome evidence
