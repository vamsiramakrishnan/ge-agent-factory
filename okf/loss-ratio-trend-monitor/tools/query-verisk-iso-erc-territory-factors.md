---
type: Agent Tool
title: query_verisk_iso_erc_territory_factors
description: Retrieve territory factors from Verisk ISO ERC for the Loss Ratio Trend Monitor workflow.
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

# query_verisk_iso_erc_territory_factors

Retrieve territory factors from Verisk ISO ERC for the Loss Ratio Trend Monitor workflow.

- **Kind:** query
- **Source system:** [Verisk ISO ERC](/systems/verisk-iso-erc.md)

## Inputs

- territory_code
- state
- date_range

## Outputs

- territory_factors_records

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

- territory_code
- state
- date_range

## Produces

- territory_factors_records

# Examples

```
query_verisk_iso_erc_territory_factors(territory_code=<territory_code>, state=<state>, date_range=<date_range>)
```

# Citations

- [Verisk ISO ERC](/systems/verisk-iso-erc.md)
