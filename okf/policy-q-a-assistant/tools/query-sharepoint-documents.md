---
type: Agent Tool
title: query_sharepoint_documents
description: "Retrieve documents from SharePoint for the Policy Q&A Assistant workflow."
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

# query_sharepoint_documents

Retrieve documents from SharePoint for the Policy Q&A Assistant workflow.

- **Kind:** query
- **Source system:** [SharePoint](/systems/sharepoint.md)

## Inputs

- lookup_key
- date_range

## Outputs

- documents_records
- documents_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SharePoint](/systems/sharepoint.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [policy_retrieval](/workflow/policy-retrieval.md)

## Evals

- [Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-q-a-assistant-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- documents_records
- documents_summary

# Examples

```
query_sharepoint_documents(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SharePoint](/systems/sharepoint.md)
