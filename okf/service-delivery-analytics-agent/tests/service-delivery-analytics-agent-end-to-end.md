---
type: Eval Scenario
title: Run the Service Delivery Analytics Agent workflow for the current period. Cit...
description: "Run the Service Delivery Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "service-delivery-analytics-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Service Delivery Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [service-data-ingestion](/queries/service-data-ingestion.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_service_delivery_analytics_agent_policy_handbook](/tools/lookup-service-delivery-analytics-agent-policy-handbook.md)

## Success rubric

HR Ops Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Service Delivery Analytics Agent Policy Handbook](/documents/service-delivery-analytics-agent-policy-handbook.md)
