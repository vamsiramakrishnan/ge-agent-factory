---
type: Workflow Stage
title: "Blast-Radius & Severity Scoring"
description: "Score cell_sites and performance_counters (rsrp_avg_dbm, sinr_avg_db, cell_availability_pct) against BigQuery analytics_events and historical_metrics baselines to size the customer- and mobile-site-impact radius and set severity ahead of dispatch."
source_id: blast_radius_severity_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Blast-Radius & Severity Scoring

Score cell_sites and performance_counters (rsrp_avg_dbm, sinr_avg_db, cell_availability_pct) against BigQuery analytics_events and historical_metrics baselines to size the customer- and mobile-site-impact radius and set severity ahead of dispatch.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)

Next: [Diagnostic History & Prior-Work Check](/workflow/diagnostic-history-prior-work-check.md)
