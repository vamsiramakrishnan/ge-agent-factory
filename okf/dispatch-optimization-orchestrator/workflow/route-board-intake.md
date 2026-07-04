---
type: Workflow Stage
title: Route Board Intake
description: "Pull the day's field_work_orders and technician_schedules from Oracle Field Service to rebuild the route board at shift start and again after every cancellation or overrun."
source_id: route_board_intake
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Route Board Intake

Pull the day's field_work_orders and technician_schedules from Oracle Field Service to rebuild the route board at shift start and again after every cancellation or overrun.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

Next: [Skill & Certification Match](/workflow/skill-certification-match.md)
