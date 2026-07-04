---
type: Agent Tool
title: query_google_search_console_google_search_console_records
description: "Retrieve google search console records from Google Search Console for the SEO Audit & Recommendation Engine workflow."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_google_search_console_google_search_console_records

Retrieve google search console records from Google Search Console for the SEO Audit & Recommendation Engine workflow.

- **Kind:** query
- **Source system:** [Google Search Console](/systems/google-search-console.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_search_console_records_records
- google_search_console_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Search Console](/systems/google-search-console.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [technical_crawl_aggregation](/workflow/technical-crawl-aggregation.md)
- [intent_aware_diagnosis](/workflow/intent-aware-diagnosis.md)

## Evals

- [Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/seo-audit-recommendation-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_search_console_records_records
- google_search_console_records_summary

# Examples

```
query_google_search_console_google_search_console_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Search Console](/systems/google-search-console.md)
