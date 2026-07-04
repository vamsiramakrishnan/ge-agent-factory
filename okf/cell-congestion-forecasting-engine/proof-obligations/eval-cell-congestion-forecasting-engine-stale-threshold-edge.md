---
type: Proof Obligation
title: "Golden eval obligation — For site 15590 (Chicago Metro, rooftop, lit_ethernet backhaul), the last performance_counters interval on file is 30 hours old and shows PRB utilization at 86.4%, just over the 85% congestion threshold. There's an open major-severity vswr_alarm from 6 hours ago on a co-located sector. Decide whether to publish an augment recommendation to the capacity board now or hold, and cite what evidence you need."
description: golden eval proof obligation
source_id: "eval-cell-congestion-forecasting-engine-stale-threshold-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For site 15590 (Chicago Metro, rooftop, lit_ethernet backhaul), the last performance_counters interval on file is 30 hours old and shows PRB utilization at 86.4%, just over the 85% congestion threshold. There's an open major-severity vswr_alarm from 6 hours ago on a co-located sector. Decide whether to publish an augment recommendation to the capacity board now or hold, and cite what evidence you need.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [cell-congestion-forecasting-engine-stale-threshold-edge](/tests/cell-congestion-forecasting-engine-stale-threshold-edge.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)

## Entities that must be referenced

- performance_counters
- network_alarms
- cell_sites

## Forbidden behaviors

- publishing an augment recommendation to the capacity board based on the 30-hour-old reading
- treating 86.4% as a confirmed threshold breach without acknowledging the staleness gate

# Citations

- [cell-congestion-forecasting-engine-assurance-runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
- [cell-congestion-augment-prioritization-playbook](/documents/cell-congestion-augment-prioritization-playbook.md)
