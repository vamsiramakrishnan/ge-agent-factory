---
type: Workflow Stage
title: "Exposure & Last-Time-Buy Quantification"
description: "Pull analytics_events and historical_metrics from BigQuery to compute remaining demand, current stock position, and the last-time-buy quantity required per affected part before the supplier's EOL cutoff."
source_id: exposure_last_time_buy_quantification
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exposure & Last-Time-Buy Quantification

Pull analytics_events and historical_metrics from BigQuery to compute remaining demand, current stock position, and the last-time-buy quantity required per affected part before the supplier's EOL cutoff.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_component_obsolescence_risk_monitor_sop](/tools/lookup-component-obsolescence-risk-monitor-sop.md)

Next: [SOP & Export-Control Citation Gate](/workflow/sop-export-control-citation-gate.md)
