---
type: Eval Scenario
title: Run the Material Shortage Early Warning Monitor workflow for the current peri...
description: "Run the Material Shortage Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "material-shortage-early-warning-monitor-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Material Shortage Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [coverage-netting](/queries/coverage-netting.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)
- [action_sap_s_4hana_mm_draft](/tools/action-sap-s-4hana-mm-draft.md)

## Success rubric

Action draft executed against SAP S/4HANA MM, with audit-trail entry and Supply Planner notified of outcomes.

# Citations

- [Material Shortage Early Warning Monitor Standard Operating Procedure](/documents/material-shortage-early-warning-monitor-sop.md)
