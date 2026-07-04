---
type: Proof Obligation
title: "Golden eval obligation — Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sla-breach-predictor-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the SLA Breach Predictor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sla-breach-predictor-end-to-end](/tests/sla-breach-predictor-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_it_3_it_3_records](/tools/query-it-3-it-3-records.md)
- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Entities that must be referenced

- tickets
- analytics_events
- it_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [sla-breach-predictor-runbook](/documents/sla-breach-predictor-runbook.md)
