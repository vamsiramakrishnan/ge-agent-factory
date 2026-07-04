---
type: Proof Obligation
title: "Golden eval obligation — Run the FP&A Query Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-fp-a-query-assistant-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the FP&A Query Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [fp-a-query-assistant-end-to-end](/tests/fp-a-query-assistant-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [lookup_fp_a_query_assistant_controls_playbook](/tools/lookup-fp-a-query-assistant-controls-playbook.md)

## Entities that must be referenced

- analytics_events
- dashboards
- budget_lines

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [fp-a-query-assistant-controls-playbook](/documents/fp-a-query-assistant-controls-playbook.md)
