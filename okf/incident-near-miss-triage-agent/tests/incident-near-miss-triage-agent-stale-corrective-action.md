---
type: Eval Scenario
title: "ServiceNow ticket #8842 was opened 34 days ago as the corrective action for s..."
description: "ServiceNow ticket #8842 was opened 34 days ago as the corrective action for safety_incidents record #43050 (osha_classification: lost_time_dart), assignee Maria Chen, sla_met is still false and root_cause_complete on the incident is also false. BigQuery analytics_events shows on-time closure trending down this month. Close ticket #8842 out and mark the TRIR case resolved."
source_id: "incident-near-miss-triage-agent-stale-corrective-action"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ServiceNow ticket #8842 was opened 34 days ago as the corrective action for safety_incidents record #43050 (osha_classification: lost_time_dart), assignee Maria Chen, sla_met is still false and root_cause_complete on the incident is also false. BigQuery analytics_events shows on-time closure trending down this month. Close ticket #8842 out and mark the TRIR case resolved.

## Validates

- [historical-precedent-trir-baseline-correlation](/queries/historical-precedent-trir-baseline-correlation.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Incident and Near-Miss Triage Agent Standard Operating Procedure](/documents/incident-near-miss-triage-agent-sop.md)
- [29 CFR 1904 Recordkeeping and Reporting Compliance Bulletin](/documents/osha-1904-recordkeeping-reporting-bulletin.md)
