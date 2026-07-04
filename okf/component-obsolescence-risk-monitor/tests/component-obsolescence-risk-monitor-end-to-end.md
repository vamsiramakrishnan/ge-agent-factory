---
type: Eval Scenario
title: Run the Component Obsolescence Risk Monitor workflow for the current period. ...
description: "Run the Component Obsolescence Risk Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "component-obsolescence-risk-monitor-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Component Obsolescence Risk Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [eol-signal-bom-correlation](/queries/eol-signal-bom-correlation.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)
- [action_ptc_windchill_plm_recommend](/tools/action-ptc-windchill-plm-recommend.md)

## Success rubric

Action recommend executed against PTC Windchill PLM, with audit-trail entry and Component Engineer notified of outcomes.

# Citations

- [Component Obsolescence Risk Monitor Standard Operating Procedure](/documents/component-obsolescence-risk-monitor-sop.md)
