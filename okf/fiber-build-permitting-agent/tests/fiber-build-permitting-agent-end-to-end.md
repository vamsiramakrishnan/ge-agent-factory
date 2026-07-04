---
type: Eval Scenario
title: Run the Fiber Build Permitting Agent workflow for the current period. Cite th...
description: "Run the Fiber Build Permitting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fiber-build-permitting-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Fiber Build Permitting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [permit-gated-work-order-triage](/queries/permit-gated-work-order-triage.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

## Success rubric

Action escalate executed against Oracle Field Service, with audit-trail entry and Construction Program Manager notified of outcomes.

# Citations

- [Fiber Build Permitting Agent Service Assurance Runbook](/documents/fiber-build-permitting-agent-assurance-runbook.md)
