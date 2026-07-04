---
type: Agent Tool
title: query_google_news_api_google_news_api_records
description: Retrieve google news api records from Google News API for the Crisis Communications Advisor workflow.
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

# query_google_news_api_google_news_api_records

Retrieve google news api records from Google News API for the Crisis Communications Advisor workflow.

- **Kind:** query
- **Source system:** [Google News API](/systems/google-news-api.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_news_api_records_records
- google_news_api_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google News API](/systems/google-news-api.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/crisis-communications-advisor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_news_api_records_records
- google_news_api_records_summary

# Examples

```
query_google_news_api_google_news_api_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google News API](/systems/google-news-api.md)
