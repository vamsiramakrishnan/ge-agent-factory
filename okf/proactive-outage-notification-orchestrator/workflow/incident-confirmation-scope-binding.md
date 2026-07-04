---
type: Workflow Stage
title: "Incident Confirmation & Scope Binding"
description: "Pull the triggering record from ServiceNow incidents (priority, category, status, created_at) and check for an overlapping ServiceNow change_requests maintenance window on the same category/timeframe, so a scheduled change is never mistaken for an unplanned outage before any customer-facing step runs."
source_id: incident_confirmation_scope_binding
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Incident Confirmation & Scope Binding

Pull the triggering record from ServiceNow incidents (priority, category, status, created_at) and check for an overlapping ServiceNow change_requests maintenance window on the same category/timeframe, so a scheduled change is never mistaken for an unplanned outage before any customer-facing step runs.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)

Next: [Customer & Queue Impact Mapping](/workflow/customer-queue-impact-mapping.md)
