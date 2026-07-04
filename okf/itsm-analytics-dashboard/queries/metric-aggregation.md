---
type: Query Capability
title: "Pull ITSM metrics from ServiceNow across all processes — incident volume, req..."
description: "Pull ITSM metrics from ServiceNow across all processes — incident volume, request fulfillment time, change failure rates, problem resolution, and CSAT scores."
source_id: "metric-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull ITSM metrics from ServiceNow across all processes — incident volume, request fulfillment time, change failure rates, problem resolution, and CSAT scores.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_itsm_analytics_dashboard_runbook](/tools/lookup-itsm-analytics-dashboard-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Runs in

- [metric_aggregation](/workflow/metric-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ITSM Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/itsm-analytics-dashboard-end-to-end.md)

# Citations

- [ITSM Analytics Dashboard Operations Runbook](/documents/itsm-analytics-dashboard-runbook.md)
