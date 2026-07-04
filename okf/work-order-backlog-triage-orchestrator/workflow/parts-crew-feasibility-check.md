---
type: Workflow Stage
title: "Parts & crew feasibility check"
description: "Check work_order_status=awaiting_parts records against BigQuery cached_aggregates parts-lead-time figures and technician availability, then bundle multiple maintenance_work_orders on the same asset_number into a single crew visit."
source_id: parts_crew_feasibility_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Parts & crew feasibility check

Check work_order_status=awaiting_parts records against BigQuery cached_aggregates parts-lead-time figures and technician availability, then bundle multiple maintenance_work_orders on the same asset_number into a single crew visit.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_work_order_backlog_triage_orchestrator_sop](/tools/lookup-work-order-backlog-triage-orchestrator-sop.md)

Next: [SOP-gated escalation](/workflow/sop-gated-escalation.md)
