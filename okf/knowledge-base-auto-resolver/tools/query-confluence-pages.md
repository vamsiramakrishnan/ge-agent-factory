---
type: Agent Tool
title: query_confluence_pages
description: "Retrieve pages from Confluence for the Knowledge Base Auto-Resolver workflow."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_confluence_pages

Retrieve pages from Confluence for the Knowledge Base Auto-Resolver workflow.

- **Kind:** query
- **Source system:** [Confluence](/systems/confluence.md)

## Inputs

- lookup_key
- date_range

## Outputs

- pages_records
- pages_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Confluence](/systems/confluence.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [semantic_knowledge_retrieval](/workflow/semantic-knowledge-retrieval.md)

## Evals

- [Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/knowledge-base-auto-resolver-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- pages_records
- pages_summary

# Examples

```
query_confluence_pages(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Confluence](/systems/confluence.md)
