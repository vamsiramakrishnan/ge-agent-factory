---
type: Workflow Stage
title: Retrieve Records
description: Query field work orders and technician schedules from Oracle Field Service and correlate with ServiceNow for the Fiber Build Permitting Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query field work orders and technician schedules from Oracle Field Service and correlate with ServiceNow for the Fiber Build Permitting Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fiber_build_permitting_agent_assurance_runbook](/tools/lookup-fiber-build-permitting-agent-assurance-runbook.md)
- [action_oracle_field_service_escalate](/tools/action-oracle-field-service-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
