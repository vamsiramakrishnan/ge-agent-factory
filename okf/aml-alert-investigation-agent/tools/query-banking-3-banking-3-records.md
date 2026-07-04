---
type: Agent Tool
title: query_banking_3_banking_3_records
description: Retrieve banking 3 records from BANKING 3 for the AML Alert Investigation Agent workflow.
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

# query_banking_3_banking_3_records

Retrieve banking 3 records from BANKING 3 for the AML Alert Investigation Agent workflow.

- **Kind:** query
- **Source system:** [BANKING 3](/systems/banking-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- banking_3_records_records
- banking_3_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BANKING 3](/systems/banking-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [validate_evidence](/workflow/validate-evidence.md)

## Evals

- [Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/aml-alert-investigation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- banking_3_records_records
- banking_3_records_summary

# Examples

```
query_banking_3_banking_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BANKING 3](/systems/banking-3.md)
