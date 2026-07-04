---
type: Proof Obligation
title: "Golden eval obligation — Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook."
description: golden eval proof obligation
source_id: "eval-cell-congestion-forecasting-engine-conflicting-utilization"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [cell-congestion-forecasting-engine-conflicting-utilization](/tests/cell-congestion-forecasting-engine-conflicting-utilization.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)

## Entities that must be referenced

- performance_counters
- cached_aggregates
- network_alarms

## Forbidden behaviors

- blending the conflicting utilization readings into a single number without flagging the discrepancy
- recommending or publishing a carrier add before the reconciliation and alarm check are complete

# Citations

- [cell-congestion-forecasting-engine-assurance-runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
- [cell-congestion-augment-prioritization-playbook](/documents/cell-congestion-augment-prioritization-playbook.md)
