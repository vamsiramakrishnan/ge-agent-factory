---
type: Agent Tool
title: query_kinaxis_rapidresponse_scenario_runs
description: Retrieve scenario runs from Kinaxis RapidResponse for the Expedite Request Triage Agent workflow.
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

# query_kinaxis_rapidresponse_scenario_runs

Retrieve scenario runs from Kinaxis RapidResponse for the Expedite Request Triage Agent workflow.

- **Kind:** query
- **Source system:** [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)

## Inputs

- run_number
- date_range

## Outputs

- scenario_runs_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- run_number
- date_range

## Produces

- scenario_runs_records

# Examples

```
query_kinaxis_rapidresponse_scenario_runs(run_number=<run_number>, date_range=<date_range>)
```

# Citations

- [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
