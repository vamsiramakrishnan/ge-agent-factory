---
type: Agent Tool
title: query_coupa_catalog_catalog_items
description: "Retrieve catalog items from Coupa catalog for the Catalog Curation & Recommendation workflow."
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

# query_coupa_catalog_catalog_items

Retrieve catalog items from Coupa catalog for the Catalog Curation & Recommendation workflow.

- **Kind:** query
- **Source system:** [Coupa catalog](/systems/coupa-catalog.md)

## Inputs

- lookup_key
- date_range

## Outputs

- catalog_items_records
- catalog_items_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa catalog](/systems/coupa-catalog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [query_interpretation](/workflow/query-interpretation.md)
- [result_presentation](/workflow/result-presentation.md)

## Evals

- [Run the Catalog Curation & Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/catalog-curation-recommendation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- catalog_items_records
- catalog_items_summary

# Examples

```
query_coupa_catalog_catalog_items(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Coupa catalog](/systems/coupa-catalog.md)
