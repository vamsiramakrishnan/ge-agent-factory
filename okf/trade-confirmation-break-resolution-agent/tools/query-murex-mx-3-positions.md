---
type: Agent Tool
title: query_murex_mx_3_positions
description: Retrieve positions from Murex MX.3 for the Trade Confirmation Break Resolution Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_murex_mx_3_positions

Retrieve positions from Murex MX.3 for the Trade Confirmation Break Resolution Agent workflow.

- **Kind:** query
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)

## Inputs

- position_id
- cusip
- date_range

## Outputs

- positions_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Murex MX.3](/systems/murex-mx-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- position_id
- cusip
- date_range

## Produces

- positions_records

# Examples

```
query_murex_mx_3_positions(position_id=<position_id>, cusip=<cusip>, date_range=<date_range>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
