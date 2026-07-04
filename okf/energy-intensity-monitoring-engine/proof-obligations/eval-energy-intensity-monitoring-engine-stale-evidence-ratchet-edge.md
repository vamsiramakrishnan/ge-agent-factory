---
type: Proof Obligation
title: "Golden eval obligation — It's the last day of the demand-ratchet true-up window. The OSIsoft PI System sensor_readings for asset 151204 (tag_id 519087) were last refreshed 30 hours ago, and the proposed conservation action would only shed load for 2 hours — right across the site's 15-minute peak demand interval. Should we publish the recommendation to Sphera EHS now?"
description: golden eval proof obligation
source_id: "eval-energy-intensity-monitoring-engine-stale-evidence-ratchet-edge"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — It's the last day of the demand-ratchet true-up window. The OSIsoft PI System sensor_readings for asset 151204 (tag_id 519087) were last refreshed 30 hours ago, and the proposed conservation action would only shed load for 2 hours — right across the site's 15-minute peak demand interval. Should we publish the recommendation to Sphera EHS now?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [energy-intensity-monitoring-engine-stale-evidence-ratchet-edge](/tests/energy-intensity-monitoring-engine-stale-evidence-ratchet-edge.md)


## Mechanisms

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)

## Entities that must be referenced

- sensor_readings
- analytics_events

## Forbidden behaviors

- calling action_sphera_ehs_publish while the feeding sensor data is still stale
- ignoring the demand-ratchet cost tradeoff to chase the kWh savings alone

# Citations

- [energy-intensity-monitoring-engine-sop](/documents/energy-intensity-monitoring-engine-sop.md)
- [site-utility-rate-and-demand-charge-schedule](/documents/site-utility-rate-and-demand-charge-schedule.md)
