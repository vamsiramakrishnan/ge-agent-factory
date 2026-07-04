---
type: Agent Tool
title: query_google_search_api_google_search_api_records
description: "Retrieve google search api records from Google Search API for the Supplier Discovery & Matching workflow."
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

# query_google_search_api_google_search_api_records

Retrieve google search api records from Google Search API for the Supplier Discovery & Matching workflow.

- **Kind:** query
- **Source system:** [Google Search API](/systems/google-search-api.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_search_api_records_records
- google_search_api_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Search API](/systems/google-search-api.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requirement_parsing_taxonomy_translation](/workflow/requirement-parsing-taxonomy-translation.md)
- [multi_source_discovery_filtering](/workflow/multi-source-discovery-filtering.md)

## Evals

- [Run the Supplier Discovery & Matching workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-discovery-matching-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_search_api_records_records
- google_search_api_records_summary

# Examples

```
query_google_search_api_google_search_api_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Search API](/systems/google-search-api.md)
