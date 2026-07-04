---
type: Agent Tool
title: query_google_ads_campaigns
description: Retrieve campaigns from Google Ads for the PPC Bid Management Agent workflow.
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

# query_google_ads_campaigns

Retrieve campaigns from Google Ads for the PPC Bid Management Agent workflow.

- **Kind:** query
- **Source system:** [Google Ads](/systems/google-ads.md)

## Inputs

- lookup_key
- date_range

## Outputs

- campaigns_records
- campaigns_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Ads](/systems/google-ads.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [performance_aggregation](/workflow/performance-aggregation.md)

## Evals

- [Run the PPC Bid Management Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ppc-bid-management-agent-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- campaigns_records
- campaigns_summary

# Examples

```
query_google_ads_campaigns(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Ads](/systems/google-ads.md)
