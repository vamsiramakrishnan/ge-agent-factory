---
type: Agent Tool
title: query_bls_data_bls_data_records
description: Retrieve bls data records from BLS Data for the Labor Market Intelligence workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bls_data_bls_data_records

Retrieve bls data records from BLS Data for the Labor Market Intelligence workflow.

- **Kind:** query
- **Source system:** [BLS Data](/systems/bls-data.md)

## Inputs

- lookup_key
- date_range

## Outputs

- bls_data_records_records
- bls_data_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BLS Data](/systems/bls-data.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [market_data_ingestion](/workflow/market-data-ingestion.md)
- [intelligence_brief_generation](/workflow/intelligence-brief-generation.md)

## Evals

- [Run the Labor Market Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/labor-market-intelligence-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- bls_data_records_records
- bls_data_records_summary

# Examples

```
query_bls_data_bls_data_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BLS Data](/systems/bls-data.md)
