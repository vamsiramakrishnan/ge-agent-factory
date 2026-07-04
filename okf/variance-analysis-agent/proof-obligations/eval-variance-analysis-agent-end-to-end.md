---
type: Proof Obligation
title: "Golden eval obligation — Run the Variance Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-variance-analysis-agent-end-to-end"
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

# Golden eval obligation — Run the Variance Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [variance-analysis-agent-end-to-end](/tests/variance-analysis-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_variance_analysis_agent_controls_playbook](/tools/lookup-variance-analysis-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)

## Entities that must be referenced

- gl_entries
- budget_lines
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [variance-analysis-agent-controls-playbook](/documents/variance-analysis-agent-controls-playbook.md)
