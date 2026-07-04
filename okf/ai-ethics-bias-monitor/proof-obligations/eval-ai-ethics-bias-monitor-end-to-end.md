---
type: Proof Obligation
title: "Golden eval obligation — Run the AI Ethics & Bias Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-ai-ethics-bias-monitor-end-to-end"
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

# Golden eval obligation — Run the AI Ethics & Bias Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [ai-ethics-bias-monitor-end-to-end](/tests/ai-ethics-bias-monitor-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_it_2_it_2_records](/tools/query-it-2-it-2-records.md)
- [query_it_3_it_3_records](/tools/query-it-3-it-3-records.md)
- [lookup_ai_ethics_bias_monitor_runbook](/tools/lookup-ai-ethics-bias-monitor-runbook.md)
- [action_it_2_recommend](/tools/action-it-2-recommend.md)

## Entities that must be referenced

- analytics_events
- it_2_records
- it_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [ai-ethics-bias-monitor-runbook](/documents/ai-ethics-bias-monitor-runbook.md)
