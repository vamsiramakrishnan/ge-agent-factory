---
type: Query Capability
title: "Score cell_sites and performance_counters (rsrp_avg_dbm, sinr_avg_db, cell_av..."
description: "Score cell_sites and performance_counters (rsrp_avg_dbm, sinr_avg_db, cell_availability_pct) against BigQuery analytics_events and historical_metrics baselines to size the customer- and mobile-site-impact radius and set severity ahead of dispatch."
source_id: "blast-radius-severity-scoring"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Score cell_sites and performance_counters (rsrp_avg_dbm, sinr_avg_db, cell_availability_pct) against BigQuery analytics_events and historical_metrics baselines to size the customer- and mobile-site-impact radius and set severity ahead of dispatch.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)

## Runs in

- [blast_radius_severity_scoring](/workflow/blast-radius-severity-scoring.md)

## Evidence expected

- sql_result

## Evals

- [Run the Fiber Cut Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fiber-cut-triage-agent-end-to-end.md)
- [Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=fiber_cut with clear_status=active since 2026-07-02T03:14, but ticket #2456789 in ServiceNow shows status=resolved as of 2026-07-03T09:00. Splunk shows no log_events or search_job activity for that ne_id in the last 30 hours. Should we close this out and stand the crew down?](/tests/fiber-cut-triage-agent-conflicting-stale-evidence.md)

# Citations

- [Fiber Cut Triage Agent Service Assurance Runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)
- [Underground Facility Damage Prevention & One-Call Locate Compliance Policy](/documents/fiber-cut-triage-agent-locate-damage-prevention-policy.md)
