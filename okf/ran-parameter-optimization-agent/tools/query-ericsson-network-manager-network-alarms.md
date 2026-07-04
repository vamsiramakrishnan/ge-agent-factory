---
type: Agent Tool
title: query_ericsson_network_manager_network_alarms
description: Retrieve network alarms from Ericsson Network Manager for the RAN Parameter Optimization Agent workflow.
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

Retrieve network alarms from Ericsson Network Manager for the RAN Parameter Optimization Agent workflow.

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

- [counter_alarm_ingestion](/workflow/counter-alarm-ingestion.md)
- [recommend_stage_for_approval](/workflow/recommend-stage-for-approval.md)

## Evals

- [Run the RAN Parameter Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ran-parameter-optimization-agent-end-to-end.md)
- [Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the coverage team (change ticket 2043211) queued for this Thursday's window, and performance_counters show PRB utilization already at 91% with an energy-saving power reduction applied to the same site last Tuesday. Recommend whether to proceed with the tilt change for this week's cluster review.](/tests/ran-parameter-optimization-agent-conflicting-parameter-changes.md)
- [Parameter change action ENM-88213 was pushed to cell 15630 four days ago to fix its VoLTE drop rate; the last performance_counters refresh for that cell is timestamped 2026-06-29 (5 days old) and cell_availability_pct hasn't updated since. Confirm whether the change held and can be closed out.](/tests/ran-parameter-optimization-agent-stale-verification-window.md)

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
