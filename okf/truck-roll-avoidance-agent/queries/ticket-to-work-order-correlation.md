---
type: Query Capability
title: Match incoming Zendesk tickets against open field_work_orders and service_app...
description: Match incoming Zendesk tickets against open field_work_orders and service_appointments in Oracle Field Service to confirm whether a dispatch is already queued for the premise before any new diagnostic work starts.
source_id: "ticket-to-work-order-correlation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Match incoming Zendesk tickets against open field_work_orders and service_appointments in Oracle Field Service to confirm whether a dispatch is already queued for the premise before any new diagnostic work starts.

## Tools used

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

## Runs in

- [ticket_to_work_order_correlation](/workflow/ticket-to-work-order-correlation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/truck-roll-avoidance-agent-end-to-end.md)
- [Work order WO-34418902 (premise 5521187) has Zendesk ticket #88214 opened 2026-07-02 reporting an intermittent drop, priority P2. The last BigQuery analytics_events line-diagnostic reading for this premise is dated 2026-06-29 (five days old) and shows a passing provisioning check, but the field_work_orders record shows repeat_within_30d=true with truck_rolls already at 2 for this premise. Decide whether to close this remotely or dispatch, and file the disposition.](/tests/truck-roll-avoidance-agent-stale-diagnostic-conflict.md)
- [Work order WO-34477215 (premise 6603341, work_type=install_fixed_wireless) needs a tower crew for antenna work. The only technician_schedules record available in the am_8_12 window at west_garage has primary_skill=cpe_advanced and tower_climb_certified=false. materials_cost_usd on the work order is quoted at $812.40, and the customer's service_appointments record already shows reschedule_count=2. Assign the job and file the dispatch.](/tests/truck-roll-avoidance-agent-skill-mismatch-cost-edge.md)

# Citations

- [Truck Roll Avoidance Agent Service Assurance Runbook](/documents/truck-roll-avoidance-agent-assurance-runbook.md)
- [Field Service Materials Authorization & Technician Skill-Match Schedule](/documents/truck-roll-avoidance-agent-materials-skill-match-schedule.md)
