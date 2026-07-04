---
type: Proof Obligation
title: "Golden eval obligation — Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-customer-voice-review-monitor-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Customer Voice & Review Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [customer-voice-review-monitor-end-to-end](/tests/customer-voice-review-monitor-end-to-end.md)


## Mechanisms

- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [query_trustpilot_trustpilot_records](/tools/query-trustpilot-trustpilot-records.md)
- [query_gartner_peer_insights_gartner_peer_insights_records](/tools/query-gartner-peer-insights-gartner-peer-insights-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_customer_voice_review_monitor_playbook](/tools/lookup-customer-voice-review-monitor-playbook.md)
- [action_g2_draft](/tools/action-g2-draft.md)

## Entities that must be referenced

- g2_records
- trustpilot_records
- gartner_peer_insights_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [customer-voice-review-monitor-playbook](/documents/customer-voice-review-monitor-playbook.md)
