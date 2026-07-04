---
type: Agent Tool
title: query_ericsson_network_manager_network_alarms
description: Retrieve network alarms from Ericsson Network Manager for the Alarm Noise Reduction Engine workflow.
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

Retrieve network alarms from Ericsson Network Manager for the Alarm Noise Reduction Engine workflow.

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

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Alarm Noise Reduction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/alarm-noise-reduction-engine-end-to-end.md)

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
