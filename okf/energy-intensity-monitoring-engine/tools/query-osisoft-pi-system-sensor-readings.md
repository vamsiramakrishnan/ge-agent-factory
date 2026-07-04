---
type: Agent Tool
title: query_osisoft_pi_system_sensor_readings
description: Retrieve sensor readings from OSIsoft PI System for the Energy Intensity Monitoring Engine workflow.
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

Retrieve sensor readings from OSIsoft PI System for the Energy Intensity Monitoring Engine workflow.

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

- [meter_to_production_reconciliation](/workflow/meter-to-production-reconciliation.md)
- [equipment_attribution_downtime_cross_check](/workflow/equipment-attribution-downtime-cross-check.md)
- [sop_permit_evidence_gate](/workflow/sop-permit-evidence-gate.md)

## Evals

- [Run the Energy Intensity Monitoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/energy-intensity-monitoring-engine-end-to-end.md)
- [Line 3's OSIsoft PI System sensor_readings show asset 148802 (tag_id 512340) running 22% above its alarm_high_limit for six straight hours on 2026-06-29, but BigQuery historical_metrics for that same period shows energy intensity within baseline for the line. Reconcile the two before recommending a publish.](/tests/energy-intensity-monitoring-engine-conflicting-readings.md)
- [It's the last day of the demand-ratchet true-up window. The OSIsoft PI System sensor_readings for asset 151204 (tag_id 519087) were last refreshed 30 hours ago, and the proposed conservation action would only shed load for 2 hours — right across the site's 15-minute peak demand interval. Should we publish the recommendation to Sphera EHS now?](/tests/energy-intensity-monitoring-engine-stale-evidence-ratchet-edge.md)

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
