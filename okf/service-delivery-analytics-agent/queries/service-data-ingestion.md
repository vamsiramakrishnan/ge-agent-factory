---
type: Query Capability
title: "Sync ticket volumes, resolution times, SLA adherence, and agent workload data..."
description: "Sync ticket volumes, resolution times, SLA adherence, and agent workload data from ServiceNow. Build time-series dataset for trend and capacity analysis."
source_id: "service-data-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync ticket volumes, resolution times, SLA adherence, and agent workload data from ServiceNow. Build time-series dataset for trend and capacity analysis.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_service_delivery_analytics_agent_policy_handbook](/tools/lookup-service-delivery-analytics-agent-policy-handbook.md)

## Runs in

- [service_data_ingestion](/workflow/service-data-ingestion.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Service Delivery Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/service-delivery-analytics-agent-end-to-end.md)

# Citations

- [Service Delivery Analytics Agent Policy Handbook](/documents/service-delivery-analytics-agent-policy-handbook.md)
