---
type: Agent Tool
title: query_google_ads_character_limits
description: "Look up platform-specific character limits for RSA headlines and descriptions."
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

# query_google_ads_character_limits

Look up platform-specific character limits for RSA headlines and descriptions.

- **Kind:** query
- **Source system:** [Google Ads](/systems/google-ads.md)

## Inputs

- format_type

## Outputs

- character_limit_spec

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

- [copy_generation_adaptation](/workflow/copy-generation-adaptation.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- source_system_record

## Required inputs

- format_type

## Produces

- character_limit_spec

# Examples

```
query_google_ads_character_limits(format_type=<format_type>)
```

# Citations

- [Google Ads](/systems/google-ads.md)
