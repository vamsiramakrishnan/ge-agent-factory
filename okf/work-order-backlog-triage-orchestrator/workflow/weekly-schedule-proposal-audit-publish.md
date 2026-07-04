---
type: Workflow Stage
title: "Weekly schedule proposal & audit publish"
description: "Draft the weekly schedule proposal against the Maintenance backlog and Schedule compliance KPI baselines, publish the generated_audit_trail and kpi_summary to BigQuery, and hand the Monday planning packet to the Maintenance Supervisor."
source_id: weekly_schedule_proposal_audit_publish
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Weekly schedule proposal & audit publish

Draft the weekly schedule proposal against the Maintenance backlog and Schedule compliance KPI baselines, publish the generated_audit_trail and kpi_summary to BigQuery, and hand the Monday planning packet to the Maintenance Supervisor.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)
