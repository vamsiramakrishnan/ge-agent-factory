---
type: Workflow Stage
title: Retrieve Records
description: Query field work orders and technician schedules from Oracle Field Service and correlate with Zendesk for the Truck Roll Avoidance Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query field work orders and technician schedules from Oracle Field Service and correlate with Zendesk for the Truck Roll Avoidance Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
