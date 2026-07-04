---
type: Eval Scenario
title: "Work order WO-34477215 (premise 6603341, work_type=install_fixed_wireless) ne..."
description: "Work order WO-34477215 (premise 6603341, work_type=install_fixed_wireless) needs a tower crew for antenna work. The only technician_schedules record available in the am_8_12 window at west_garage has primary_skill=cpe_advanced and tower_climb_certified=false. materials_cost_usd on the work order is quoted at $812.40, and the customer's service_appointments record already shows reschedule_count=2. Assign the job and file the dispatch."
source_id: "truck-roll-avoidance-agent-skill-mismatch-cost-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order WO-34477215 (premise 6603341, work_type=install_fixed_wireless) needs a tower crew for antenna work. The only technician_schedules record available in the am_8_12 window at west_garage has primary_skill=cpe_advanced and tower_climb_certified=false. materials_cost_usd on the work order is quoted at $812.40, and the customer's service_appointments record already shows reschedule_count=2. Assign the job and file the dispatch.

## Validates

- [remote-diagnostic-battery](/queries/remote-diagnostic-battery.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Field Service Materials Authorization & Technician Skill-Match Schedule](/documents/truck-roll-avoidance-agent-materials-skill-match-schedule.md)
- [Truck Roll Avoidance Agent Service Assurance Runbook](/documents/truck-roll-avoidance-agent-assurance-runbook.md)
