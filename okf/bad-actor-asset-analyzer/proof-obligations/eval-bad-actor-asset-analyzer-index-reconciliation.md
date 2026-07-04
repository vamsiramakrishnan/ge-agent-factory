---
type: Proof Obligation
title: "Golden eval obligation — Asset 148203 is ranked #1 by repair cost this quarter in maintenance_work_orders ($142,500 across 6 work orders) but shows only 40 minutes of downtime_events in OSIsoft PI System for the same period, while asset 151877 has 2,340 minutes of downtime but only $18,000 in work order cost. Reconcile which one is the real top bad actor and explain the discrepancy before publishing the ranking to Looker."
description: golden eval proof obligation
source_id: "eval-bad-actor-asset-analyzer-index-reconciliation"
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

# Golden eval obligation — Asset 148203 is ranked #1 by repair cost this quarter in maintenance_work_orders ($142,500 across 6 work orders) but shows only 40 minutes of downtime_events in OSIsoft PI System for the same period, while asset 151877 has 2,340 minutes of downtime but only $18,000 in work order cost. Reconcile which one is the real top bad actor and explain the discrepancy before publishing the ranking to Looker.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [bad-actor-asset-analyzer-index-reconciliation](/tests/bad-actor-asset-analyzer-index-reconciliation.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)

## Entities that must be referenced

- maintenance_work_orders
- downtime_events
- sensor_readings

## Forbidden behaviors

- Declaring one asset the top bad actor using only a single metric (cost or downtime) without computing the composite index
- Publishing the ranking to Looker before resolving the discrepancy

# Citations

- [bad-actor-asset-analyzer-sop](/documents/bad-actor-asset-analyzer-sop.md)
- [bad-actor-asset-analyzer-criticality-vibration-playbook](/documents/bad-actor-asset-analyzer-criticality-vibration-playbook.md)
