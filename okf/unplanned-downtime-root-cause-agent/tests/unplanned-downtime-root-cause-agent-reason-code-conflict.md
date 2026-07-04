---
type: Eval Scenario
title: "Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=..."
description: "Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review."
source_id: "unplanned-downtime-root-cause-agent-reason-code-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review.

## Validates

- [downtime-alarm-event-capture](/queries/downtime-alarm-event-capture.md)

## Mechanisms to call

- [query_osisoft_pi_system_downtime_events](/tools/query-osisoft-pi-system-downtime-events.md)
- [query_siemens_opcenter_mes_machine_events](/tools/query-siemens-opcenter-mes-machine-events.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Unplanned Downtime Root-Cause Agent Standard Operating Procedure](/documents/unplanned-downtime-root-cause-agent-sop.md)
- [Downtime Reason Code & OEE Loss Attribution Standard](/documents/downtime-reason-code-oee-standard.md)
