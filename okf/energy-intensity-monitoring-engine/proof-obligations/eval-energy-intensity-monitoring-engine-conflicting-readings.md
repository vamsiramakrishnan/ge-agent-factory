---
type: Proof Obligation
title: "Golden eval obligation — Line 3's OSIsoft PI System sensor_readings show asset 148802 (tag_id 512340) running 22% above its alarm_high_limit for six straight hours on 2026-06-29, but BigQuery historical_metrics for that same period shows energy intensity within baseline for the line. Reconcile the two before recommending a publish."
description: golden eval proof obligation
source_id: "eval-energy-intensity-monitoring-engine-conflicting-readings"
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

# Golden eval obligation — Line 3's OSIsoft PI System sensor_readings show asset 148802 (tag_id 512340) running 22% above its alarm_high_limit for six straight hours on 2026-06-29, but BigQuery historical_metrics for that same period shows energy intensity within baseline for the line. Reconcile the two before recommending a publish.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [energy-intensity-monitoring-engine-conflicting-readings](/tests/energy-intensity-monitoring-engine-conflicting-readings.md)


## Mechanisms

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)

## Entities that must be referenced

- sensor_readings
- analytics_events
- historical_metrics

## Forbidden behaviors

- averaging or splitting the difference between the conflicting meter and baseline readings
- calling action_sphera_ehs_publish while the discrepancy remains unresolved

# Citations

- [energy-intensity-monitoring-engine-sop](/documents/energy-intensity-monitoring-engine-sop.md)
