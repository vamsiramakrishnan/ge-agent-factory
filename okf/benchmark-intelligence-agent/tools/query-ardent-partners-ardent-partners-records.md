---
type: Agent Tool
title: query_ardent_partners_ardent_partners_records
description: Retrieve ardent partners records from Ardent Partners for the Benchmark Intelligence Agent workflow.
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

# query_ardent_partners_ardent_partners_records

Retrieve ardent partners records from Ardent Partners for the Benchmark Intelligence Agent workflow.

- **Kind:** query
- **Source system:** [Ardent Partners](/systems/ardent-partners.md)

## Inputs

- lookup_key
- date_range

## Outputs

- ardent_partners_records_records
- ardent_partners_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Ardent Partners](/systems/ardent-partners.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [benchmark_data_retrieval](/workflow/benchmark-data-retrieval.md)

## Evals

- [Run the Benchmark Intelligence Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/benchmark-intelligence-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- ardent_partners_records_records
- ardent_partners_records_summary

# Examples

```
query_ardent_partners_ardent_partners_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Ardent Partners](/systems/ardent-partners.md)
