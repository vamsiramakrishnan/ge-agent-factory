---
type: Agent Tool
title: query_ibm_maximo_failure_codes
description: Retrieve failure codes from IBM Maximo for the Predictive Asset Failure Monitor workflow.
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

# query_ibm_maximo_failure_codes

Retrieve failure codes from IBM Maximo for the Predictive Asset Failure Monitor workflow.

- **Kind:** query
- **Source system:** [IBM Maximo](/systems/ibm-maximo.md)

## Inputs

- failure_code
- date_range

## Outputs

- failure_codes_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IBM Maximo](/systems/ibm-maximo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- failure_code
- date_range

## Produces

- failure_codes_records

# Examples

```
query_ibm_maximo_failure_codes(failure_code=<failure_code>, date_range=<date_range>)
```

# Citations

- [IBM Maximo](/systems/ibm-maximo.md)
