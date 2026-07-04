---
type: Agent Tool
title: query_bigquery_historical_creative_performance
description: "Analyze historical creative performance data to identify winning messaging angles, CTAs, and psychological triggers by segment."
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

# query_bigquery_historical_creative_performance

Analyze historical creative performance data to identify winning messaging angles, CTAs, and psychological triggers by segment.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- segment
- platform

## Outputs

- performance_patterns
- winning_angles

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

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

## Required inputs

- segment
- platform

## Produces

- performance_patterns
- winning_angles

# Examples

```
query_bigquery_historical_creative_performance(segment=<segment>, platform=<platform>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
