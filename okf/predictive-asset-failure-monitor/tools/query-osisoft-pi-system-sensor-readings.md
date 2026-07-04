---
type: Agent Tool
title: query_osisoft_pi_system_sensor_readings
description: Retrieve sensor readings from OSIsoft PI System for the Predictive Asset Failure Monitor workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_osisoft_pi_system_sensor_readings

Retrieve sensor readings from OSIsoft PI System for the Predictive Asset Failure Monitor workflow.

- **Kind:** query
- **Source system:** [OSIsoft PI System](/systems/osisoft-pi-system.md)

## Inputs

- asset_number
- date_range

## Outputs

- sensor_readings_records
- sensor_readings_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [OSIsoft PI System](/systems/osisoft-pi-system.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [condition_signal_intake](/workflow/condition-signal-intake.md)
- [degradation_scoring_rul_estimation](/workflow/degradation-scoring-rul-estimation.md)

## Evals

- [Run the Predictive Asset Failure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/predictive-asset-failure-monitor-end-to-end.md)
- [Asset 148230 (a CNC machine, criticality_ranking a_constraint) has maintenance_work_orders record WO-4021873 marked 'complete' as of yesterday for a bearing_wear failure_mode, but the last six hours of sensor_readings still show vibration_mm_s trending upward toward the alarm_high_limit. Reconcile these two records and tell me whether the asset is actually healthy.](/tests/predictive-asset-failure-monitor-conflicting-closure.md)
- [Asset 152710, a stamping_press with criticality_ranking b_essential, shows sensor_type vibration_mm_s at 7.1 mm/s against an alarm_high_limit of 7.5 mm/s, with quality_flag 'uncertain' on 4 of the last 10 readings. The floor supervisor wants a same-shift disposition: run or stop. What do you recommend?](/tests/predictive-asset-failure-monitor-uncertain-quality-threshold.md)

## Evidence emitted

- sql_result

## Required inputs

- asset_number
- date_range

## Produces

- sensor_readings_records
- sensor_readings_summary

# Examples

```
query_osisoft_pi_system_sensor_readings(asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [OSIsoft PI System](/systems/osisoft-pi-system.md)
