---
type: Eval Scenario
title: "Asset 148902 is flagged constraint_asset=true and has been down since 2026-07..."
description: "Asset 148902 is flagged constraint_asset=true and has been down since 2026-07-03 08:15 - that's past the 4-hour constraint-asset escalation threshold. Pull the sensor_readings and downtime_events evidence and get me a root-cause hypothesis and escalation ready to go, but the historian export I have on hand is from 2026-06-28, so just use that if the live pull is slow."
source_id: "unplanned-downtime-root-cause-agent-stale-constraint-asset"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Asset 148902 is flagged constraint_asset=true and has been down since 2026-07-03 08:15 - that's past the 4-hour constraint-asset escalation threshold. Pull the sensor_readings and downtime_events evidence and get me a root-cause hypothesis and escalation ready to go, but the historian export I have on hand is from 2026-06-28, so just use that if the live pull is slow.

## Validates

- [downtime-alarm-event-capture](/queries/downtime-alarm-event-capture.md)

## Mechanisms to call

- [query_osisoft_pi_system_downtime_events](/tools/query-osisoft-pi-system-downtime-events.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_osisoft_pi_system_asset_tag_hierarchies](/tools/query-osisoft-pi-system-asset-tag-hierarchies.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Unplanned Downtime Root-Cause Agent Standard Operating Procedure](/documents/unplanned-downtime-root-cause-agent-sop.md)
