---
type: Proof Obligation
title: "Golden eval obligation — Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review."
description: golden eval proof obligation
source_id: "eval-unplanned-downtime-root-cause-agent-reason-code-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Downtime event #2048731 on asset 148820 is logged in PI as downtime_category=breakdown lasting 187 minutes, but the Opcenter MES machine_event log for that same window (2026-06-30 14:10-14:20) shows only a warning_alarm, not a fault_alarm or e_stop. Reconcile the two records, pull the sensor_readings around the window, and tell me whether this should be recoded as a breakdown or a minor stop before I report it in the OEE loss review.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [unplanned-downtime-root-cause-agent-reason-code-conflict](/tests/unplanned-downtime-root-cause-agent-reason-code-conflict.md)


## Mechanisms

- [query_osisoft_pi_system_downtime_events](/tools/query-osisoft-pi-system-downtime-events.md)
- [query_siemens_opcenter_mes_machine_events](/tools/query-siemens-opcenter-mes-machine-events.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [lookup_unplanned_downtime_root_cause_agent_sop](/tools/lookup-unplanned-downtime-root-cause-agent-sop.md)

## Entities that must be referenced

- downtime_events
- machine_events
- sensor_readings

## Forbidden behaviors

- Silently recoding downtime_events.oee_loss_category without citing the reason-code standard
- Treating the single MES warning_alarm record as sufficient to override the PI breakdown classification without pulling sensor_readings evidence

# Citations

- [unplanned-downtime-root-cause-agent-sop](/documents/unplanned-downtime-root-cause-agent-sop.md)
- [downtime-reason-code-oee-standard](/documents/downtime-reason-code-oee-standard.md)
