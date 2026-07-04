---
type: Agent Tool
title: query_google_ads_rsa_performance
description: "Retrieve Google Ads RSA performance metrics, headline/description combinations, and character limit constraints."
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

# query_google_ads_rsa_performance

Retrieve Google Ads RSA performance metrics, headline/description combinations, and character limit constraints.

- **Kind:** query
- **Source system:** [Google Ads](/systems/google-ads.md)

## Inputs

- campaign_id

## Outputs

- rsa_performance_data
- character_limits

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

- [campaign_brief_intake](/workflow/campaign-brief-intake.md)
- [creative_performance_analysis](/workflow/creative-performance-analysis.md)
- [copy_generation_adaptation](/workflow/copy-generation-adaptation.md)
- [test_deployment](/workflow/test-deployment.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- campaign_id

## Produces

- rsa_performance_data
- character_limits

# Examples

```
query_google_ads_rsa_performance(campaign_id=<campaign_id>)
```

# Citations

- [Google Ads](/systems/google-ads.md)
