---
type: Agent Tool
title: query_duck_creek_policy_rating_worksheets
description: Retrieve rating worksheets from Duck Creek Policy for the Policyholder Correspondence Drafting Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_duck_creek_policy_rating_worksheets

Retrieve rating worksheets from Duck Creek Policy for the Policyholder Correspondence Drafting Agent workflow.

- **Kind:** query
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)

## Inputs

- worksheet_id
- quote_number
- date_range

## Outputs

- rating_worksheets_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- worksheet_id
- quote_number
- date_range

## Produces

- rating_worksheets_records

# Examples

```
query_duck_creek_policy_rating_worksheets(worksheet_id=<worksheet_id>, quote_number=<quote_number>, date_range=<date_range>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)
