---
type: Agent Tool
title: query_ericsson_network_manager_network_alarms
description: Retrieve network alarms from Ericsson Network Manager for the Cell Congestion Forecasting Engine workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ericsson_network_manager_network_alarms

Retrieve network alarms from Ericsson Network Manager for the Cell Congestion Forecasting Engine workflow.

- **Kind:** query
- **Source system:** [Ericsson Network Manager](/systems/ericsson-network-manager.md)

## Inputs

- alarm_id
- site_id
- date_range

## Outputs

- network_alarms_records
- network_alarms_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ericsson Network Manager](/systems/ericsson-network-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alarm_counter_intake](/workflow/alarm-counter-intake.md)
- [capacity_board_publish_audit](/workflow/capacity-board-publish-audit.md)

## Evals

- [Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cell-congestion-forecasting-engine-end-to-end.md)
- [Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook.](/tests/cell-congestion-forecasting-engine-conflicting-utilization.md)
- [For site 15590 (Chicago Metro, rooftop, lit_ethernet backhaul), the last performance_counters interval on file is 30 hours old and shows PRB utilization at 86.4%, just over the 85% congestion threshold. There's an open major-severity vswr_alarm from 6 hours ago on a co-located sector. Decide whether to publish an augment recommendation to the capacity board now or hold, and cite what evidence you need.](/tests/cell-congestion-forecasting-engine-stale-threshold-edge.md)

## Evidence emitted

- sql_result

## Required inputs

- alarm_id
- site_id
- date_range

## Produces

- network_alarms_records
- network_alarms_summary

# Examples

```
query_ericsson_network_manager_network_alarms(alarm_id=<alarm_id>, site_id=<site_id>, date_range=<date_range>)
```

# Citations

- [Ericsson Network Manager](/systems/ericsson-network-manager.md)
