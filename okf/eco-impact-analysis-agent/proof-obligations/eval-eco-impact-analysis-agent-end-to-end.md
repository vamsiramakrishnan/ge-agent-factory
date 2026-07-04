---
type: Proof Obligation
title: "Golden eval obligation — Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-eco-impact-analysis-agent-end-to-end"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [eco-impact-analysis-agent-end-to-end](/tests/eco-impact-analysis-agent-end-to-end.md)


## Mechanisms

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

## Entities that must be referenced

- engineering_change_orders
- process_orders
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [eco-impact-analysis-agent-sop](/documents/eco-impact-analysis-agent-sop.md)
