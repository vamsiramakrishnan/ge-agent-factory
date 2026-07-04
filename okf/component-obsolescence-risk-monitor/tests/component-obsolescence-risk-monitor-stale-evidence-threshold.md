---
type: Eval Scenario
title: "Engineering change order ECO 24583 (class_1_form_fit_function, supplier_obsol..."
description: "Engineering change order ECO 24583 (class_1_form_fit_function, supplier_obsolescence, affected_item_count 214) is at risk. The most recent BigQuery analytics_events refresh for remaining-demand metrics is timestamped 2026-07-02 14:00 (38 hours old) and the affected part's vendor carries risk_score 'high'. Recommend whether to issue a last-time-buy order for 5,000 units before the supplier's EOL cutoff on 2026-07-06."
source_id: "component-obsolescence-risk-monitor-stale-evidence-threshold"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Engineering change order ECO 24583 (class_1_form_fit_function, supplier_obsolescence, affected_item_count 214) is at risk. The most recent BigQuery analytics_events refresh for remaining-demand metrics is timestamped 2026-07-02 14:00 (38 hours old) and the affected part's vendor carries risk_score 'high'. Recommend whether to issue a last-time-buy order for 5,000 units before the supplier's EOL cutoff on 2026-07-06.

## Validates

- [eol-signal-bom-correlation](/queries/eol-signal-bom-correlation.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Component Obsolescence Risk Monitor Standard Operating Procedure](/documents/component-obsolescence-risk-monitor-sop.md)
