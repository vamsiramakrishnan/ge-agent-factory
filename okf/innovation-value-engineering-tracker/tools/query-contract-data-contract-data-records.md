---
type: Agent Tool
title: query_contract_data_contract_data_records
description: "Retrieve contract data records from Contract Data for the Innovation & Value Engineering Tracker workflow."
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

# query_contract_data_contract_data_records

Retrieve contract data records from Contract Data for the Innovation & Value Engineering Tracker workflow.

- **Kind:** query
- **Source system:** [Contract Data](/systems/contract-data.md)

## Inputs

- lookup_key
- date_range

## Outputs

- contract_data_records_records
- contract_data_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Contract Data](/systems/contract-data.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/innovation-value-engineering-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- contract_data_records_records
- contract_data_records_summary

# Examples

```
query_contract_data_contract_data_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Contract Data](/systems/contract-data.md)
