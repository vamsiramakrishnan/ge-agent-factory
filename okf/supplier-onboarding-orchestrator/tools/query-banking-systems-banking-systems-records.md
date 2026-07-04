---
type: Agent Tool
title: query_banking_systems_banking_systems_records
description: Retrieve banking systems records from Banking Systems for the Supplier Onboarding Orchestrator workflow.
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

# query_banking_systems_banking_systems_records

Retrieve banking systems records from Banking Systems for the Supplier Onboarding Orchestrator workflow.

- **Kind:** query
- **Source system:** [Banking Systems](/systems/banking-systems.md)

## Inputs

- lookup_key
- date_range

## Outputs

- banking_systems_records_records
- banking_systems_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Banking Systems](/systems/banking-systems.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [document_collection_extraction](/workflow/document-collection-extraction.md)

## Evals

- [Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-onboarding-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- banking_systems_records_records
- banking_systems_records_summary

# Examples

```
query_banking_systems_banking_systems_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Banking Systems](/systems/banking-systems.md)
