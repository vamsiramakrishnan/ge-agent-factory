---
type: Workflow Stage
title: "Historical Precedent & TRIR Baseline Correlation"
description: "Query analytics_events in BigQuery (query_bigquery_analytics_events) to surface similar prior incidents and confirm whether this event pushes the Recordable incident rate (TRIR) off its 2.4-to-1.1 improvement path."
source_id: historical_precedent_trir_baseline_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Historical Precedent & TRIR Baseline Correlation

Query analytics_events in BigQuery (query_bigquery_analytics_events) to surface similar prior incidents and confirm whether this event pushes the Recordable incident rate (TRIR) off its 2.4-to-1.1 improvement path.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)

Next: [SOP & Recordkeeping Bulletin Evidence Gate](/workflow/sop-recordkeeping-bulletin-evidence-gate.md)
