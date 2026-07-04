---
type: Eval Scenario
title: Run the ECO Impact Analysis Agent workflow for the current period. Cite the r...
description: "Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "eco-impact-analysis-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [eco-intake-classification](/queries/eco-intake-classification.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_eco_impact_analysis_agent_sop](/tools/lookup-eco-impact-analysis-agent-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

## Success rubric

Action recommend executed against PTC Windchill PLM, with audit-trail entry and Manufacturing Engineer notified of outcomes.

# Citations

- [ECO Impact Analysis Agent Standard Operating Procedure](/documents/eco-impact-analysis-agent-sop.md)
