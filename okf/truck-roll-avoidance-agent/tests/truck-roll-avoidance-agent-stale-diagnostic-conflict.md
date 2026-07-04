---
type: Eval Scenario
title: "Work order WO-34418902 (premise 5521187) has Zendesk ticket #88214 opened 202..."
description: "Work order WO-34418902 (premise 5521187) has Zendesk ticket #88214 opened 2026-07-02 reporting an intermittent drop, priority P2. The last BigQuery analytics_events line-diagnostic reading for this premise is dated 2026-06-29 (five days old) and shows a passing provisioning check, but the field_work_orders record shows repeat_within_30d=true with truck_rolls already at 2 for this premise. Decide whether to close this remotely or dispatch, and file the disposition."
source_id: "truck-roll-avoidance-agent-stale-diagnostic-conflict"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order WO-34418902 (premise 5521187) has Zendesk ticket #88214 opened 2026-07-02 reporting an intermittent drop, priority P2. The last BigQuery analytics_events line-diagnostic reading for this premise is dated 2026-06-29 (five days old) and shows a passing provisioning check, but the field_work_orders record shows repeat_within_30d=true with truck_rolls already at 2 for this premise. Decide whether to close this remotely or dispatch, and file the disposition.

## Validates

- [remote-diagnostic-battery](/queries/remote-diagnostic-battery.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Truck Roll Avoidance Agent Service Assurance Runbook](/documents/truck-roll-avoidance-agent-assurance-runbook.md)
- [Field Service Materials Authorization & Technician Skill-Match Schedule](/documents/truck-roll-avoidance-agent-materials-skill-match-schedule.md)
