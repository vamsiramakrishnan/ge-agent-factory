---
type: Agent Tool
title: query_osisoft_pi_system_sensor_readings
description: Retrieve sensor readings from OSIsoft PI System for the Bad Actor Asset Analyzer workflow.
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

Retrieve sensor readings from OSIsoft PI System for the Bad Actor Asset Analyzer workflow.

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

- [bad_actor_candidate_pull](/workflow/bad-actor-candidate-pull.md)

## Evals

- [Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bad-actor-asset-analyzer-end-to-end.md)
- [Asset 148203 is ranked #1 by repair cost this quarter in maintenance_work_orders ($142,500 across 6 work orders) but shows only 40 minutes of downtime_events in OSIsoft PI System for the same period, while asset 151877 has 2,340 minutes of downtime but only $18,000 in work order cost. Reconcile which one is the real top bad actor and explain the discrepancy before publishing the ranking to Looker.](/tests/bad-actor-asset-analyzer-index-reconciliation.md)

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
