---
type: Agent Tool
title: query_semrush_keyword_rankings
description: Retrieve keyword rankings from SEMrush for the Content Brief Generator workflow.
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

# query_semrush_keyword_rankings

Retrieve keyword rankings from SEMrush for the Content Brief Generator workflow.

- **Kind:** query
- **Source system:** [SEMrush](/systems/semrush.md)

## Inputs

- lookup_key
- date_range

## Outputs

- keyword_rankings_records
- keyword_rankings_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SEMrush](/systems/semrush.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [keyword_competitive_data](/workflow/keyword-competitive-data.md)
- [brief_generation](/workflow/brief-generation.md)

## Evals

- [Run the Content Brief Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/content-brief-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- keyword_rankings_records
- keyword_rankings_summary

# Examples

```
query_semrush_keyword_rankings(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SEMrush](/systems/semrush.md)
