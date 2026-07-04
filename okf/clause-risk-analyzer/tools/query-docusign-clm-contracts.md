---
type: Agent Tool
title: query_docusign_clm_contracts
description: Retrieve contracts from DocuSign CLM for the Clause Risk Analyzer workflow.
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

# query_docusign_clm_contracts

Retrieve contracts from DocuSign CLM for the Clause Risk Analyzer workflow.

- **Kind:** query
- **Source system:** [DocuSign CLM](/systems/docusign-clm.md)

## Inputs

- lookup_key
- date_range

## Outputs

- contracts_records
- contracts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [DocuSign CLM](/systems/docusign-clm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [document_ingestion_parsing](/workflow/document-ingestion-parsing.md)

## Evals

- [Run the Clause Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/clause-risk-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- contracts_records
- contracts_summary

# Examples

```
query_docusign_clm_contracts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [DocuSign CLM](/systems/docusign-clm.md)
