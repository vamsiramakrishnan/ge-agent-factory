---
type: Agent Tool
title: query_ahrefs_keyword_rankings
description: "Retrieve keyword rankings from Ahrefs for the SEO Audit & Recommendation Engine workflow."
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

# query_ahrefs_keyword_rankings

Retrieve keyword rankings from Ahrefs for the SEO Audit & Recommendation Engine workflow.

- **Kind:** query
- **Source system:** [Ahrefs](/systems/ahrefs.md)

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

No explicit permission scopes declared; source-system access is tied to [Ahrefs](/systems/ahrefs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [technical_crawl_aggregation](/workflow/technical-crawl-aggregation.md)
- [ranking_competitor_analysis](/workflow/ranking-competitor-analysis.md)

## Evals

- [Run the SEO Audit & Recommendation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/seo-audit-recommendation-engine-end-to-end.md)

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
query_ahrefs_keyword_rankings(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Ahrefs](/systems/ahrefs.md)
