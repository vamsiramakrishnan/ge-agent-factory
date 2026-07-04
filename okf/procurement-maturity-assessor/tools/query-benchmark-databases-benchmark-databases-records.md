---
type: Agent Tool
title: query_benchmark_databases_benchmark_databases_records
description: Retrieve benchmark databases records from Benchmark Databases for the Procurement Maturity Assessor workflow.
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

# query_benchmark_databases_benchmark_databases_records

Retrieve benchmark databases records from Benchmark Databases for the Procurement Maturity Assessor workflow.

- **Kind:** query
- **Source system:** [Benchmark Databases](/systems/benchmark-databases.md)

## Inputs

- lookup_key
- date_range

## Outputs

- benchmark_databases_records_records
- benchmark_databases_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Benchmark Databases](/systems/benchmark-databases.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [maturity_scoring_benchmarking](/workflow/maturity-scoring-benchmarking.md)

## Evals

- [Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-maturity-assessor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- benchmark_databases_records_records
- benchmark_databases_records_summary

# Examples

```
query_benchmark_databases_benchmark_databases_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Benchmark Databases](/systems/benchmark-databases.md)
