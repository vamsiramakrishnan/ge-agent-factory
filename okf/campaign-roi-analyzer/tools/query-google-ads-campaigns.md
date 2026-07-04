---
type: Agent Tool
title: query_google_ads_campaigns
description: "Retrieve Google Ads campaign metadata including name, start date, channels, and performance metrics for cost attribution."
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

Retrieve Google Ads campaign metadata including name, start date, channels, and performance metrics for cost attribution.

- **Kind:** query
- **Source system:** [Google Ads](/systems/google-ads.md)

## Inputs

- campaign_id

## Outputs

- campaign_metadata

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

_Not bound to a workflow stage._

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)

## Evidence emitted

- source_system_record

## Required inputs

- campaign_id

## Produces

- campaign_metadata

# Examples

```
query_google_ads_campaigns(campaign_id=<campaign_id>)
```

# Citations

- [Google Ads](/systems/google-ads.md)
