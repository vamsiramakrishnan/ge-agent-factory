---
type: Agent Tool
title: query_meta_ads_manager_creative_performance
description: "Fetch Meta Ads Manager creative performance data, engagement metrics, and audience response patterns."
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

# query_meta_ads_manager_creative_performance

Fetch Meta Ads Manager creative performance data, engagement metrics, and audience response patterns.

- **Kind:** query
- **Source system:** [Meta Ads Manager](/systems/meta-ads-manager.md)

## Inputs

- campaign_id

## Outputs

- creative_performance
- audience_response

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Meta Ads Manager](/systems/meta-ads-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [campaign_brief_intake](/workflow/campaign-brief-intake.md)
- [creative_performance_analysis](/workflow/creative-performance-analysis.md)
- [test_deployment](/workflow/test-deployment.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- campaign_id

## Produces

- creative_performance
- audience_response

# Examples

```
query_meta_ads_manager_creative_performance(campaign_id=<campaign_id>)
```

# Citations

- [Meta Ads Manager](/systems/meta-ads-manager.md)
