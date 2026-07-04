---
type: Agent Tool
title: query_verisk_iso_erc_loss_cost_benchmarks
description: Retrieve loss cost benchmarks from Verisk ISO ERC for the Catastrophe Exposure Rollup Engine workflow.
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

# query_verisk_iso_erc_loss_cost_benchmarks

Retrieve loss cost benchmarks from Verisk ISO ERC for the Catastrophe Exposure Rollup Engine workflow.

- **Kind:** query
- **Source system:** [Verisk ISO ERC](/systems/verisk-iso-erc.md)

## Inputs

- benchmark_id
- class_code
- date_range

## Outputs

- loss_cost_benchmarks_records
- loss_cost_benchmarks_summary

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

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cat-exposure-rollup-engine-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- benchmark_id
- class_code
- date_range

## Produces

- loss_cost_benchmarks_records
- loss_cost_benchmarks_summary

# Examples

```
query_verisk_iso_erc_loss_cost_benchmarks(benchmark_id=<benchmark_id>, class_code=<class_code>, date_range=<date_range>)
```

# Citations

- [Verisk ISO ERC](/systems/verisk-iso-erc.md)
