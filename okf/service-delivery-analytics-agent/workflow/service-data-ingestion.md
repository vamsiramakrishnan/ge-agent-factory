---
type: Workflow Stage
title: Service Data Ingestion
description: "Sync ticket volumes, resolution times, SLA adherence, and agent workload data from ServiceNow. Build time-series dataset for trend and capacity analysis."
source_id: service_data_ingestion
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Service Data Ingestion

Sync ticket volumes, resolution times, SLA adherence, and agent workload data from ServiceNow. Build time-series dataset for trend and capacity analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_service_delivery_analytics_agent_policy_handbook](/tools/lookup-service-delivery-analytics-agent-policy-handbook.md)

Next: [Queue Intelligence](/workflow/queue-intelligence.md)
