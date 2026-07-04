---
type: Agent Tool
title: query_industry_benchmarks_industry_benchmarks_records
description: "Retrieve industry benchmarks records from Industry benchmarks for the Should-Cost Modeler workflow."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_industry_benchmarks_industry_benchmarks_records

Retrieve industry benchmarks records from Industry benchmarks for the Should-Cost Modeler workflow.

- **Kind:** query
- **Source system:** [Industry benchmarks](/systems/industry-benchmarks.md)

## Inputs

- lookup_key
- date_range

## Outputs

- industry_benchmarks_records_records
- industry_benchmarks_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Industry benchmarks](/systems/industry-benchmarks.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_data_assembly](/workflow/cost-data-assembly.md)

## Evals

- [Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/should-cost-modeler-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- industry_benchmarks_records_records
- industry_benchmarks_records_summary

# Examples

```
query_industry_benchmarks_industry_benchmarks_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Industry benchmarks](/systems/industry-benchmarks.md)
