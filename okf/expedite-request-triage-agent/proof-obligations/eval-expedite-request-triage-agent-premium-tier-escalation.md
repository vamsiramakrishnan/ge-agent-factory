---
type: Proof Obligation
title: "Golden eval obligation — Vendor Meridian Fasteners (risk_score: high) submitted an expedite premium quote of $18,400 against PO 4500198821 (amount $62,000) to hit a Tuesday 2026-07-07 dock date. Determine whether this clears our authorization path before we commit."
description: golden eval proof obligation
source_id: "eval-expedite-request-triage-agent-premium-tier-escalation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Vendor Meridian Fasteners (risk_score: high) submitted an expedite premium quote of $18,400 against PO 4500198821 (amount $62,000) to hit a Tuesday 2026-07-07 dock date. Determine whether this clears our authorization path before we commit.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [expedite-request-triage-agent-premium-tier-escalation](/tests/expedite-request-triage-agent-premium-tier-escalation.md)


## Mechanisms

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)

## Entities that must be referenced

- purchase_orders
- vendors

## Forbidden behaviors

- approving the premium spend without checking it against the rate schedule's approval-thresholds section
- committing to the vendor's dock date before the tier-ceiling check is resolved

# Citations

- [expedite-request-triage-agent-sop](/documents/expedite-request-triage-agent-sop.md)
- [expedite-request-triage-agent-rate-schedule](/documents/expedite-request-triage-agent-rate-schedule.md)
