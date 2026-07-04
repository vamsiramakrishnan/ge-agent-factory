---
type: Agent Tool
title: query_verisk_iso_erc_circular_updates
description: Retrieve circular updates from Verisk ISO ERC for the Rate Indication Preparation Engine workflow.
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

# query_verisk_iso_erc_circular_updates

Retrieve circular updates from Verisk ISO ERC for the Rate Indication Preparation Engine workflow.

- **Kind:** query
- **Source system:** [Verisk ISO ERC](/systems/verisk-iso-erc.md)

## Inputs

- circular_id
- date_range

## Outputs

- circular_updates_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Verisk ISO ERC](/systems/verisk-iso-erc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result

## Required inputs

- circular_id
- date_range

## Produces

- circular_updates_records

# Examples

```
query_verisk_iso_erc_circular_updates(circular_id=<circular_id>, date_range=<date_range>)
```

# Citations

- [Verisk ISO ERC](/systems/verisk-iso-erc.md)
