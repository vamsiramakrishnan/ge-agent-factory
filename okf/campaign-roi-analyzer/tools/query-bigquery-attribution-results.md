---
type: Agent Tool
title: query_bigquery_attribution_results
description: "Query pre-computed multi-touch attribution results including model type, weighted revenue, CAC, and confidence metrics."
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

# query_bigquery_attribution_results

Query pre-computed multi-touch attribution results including model type, weighted revenue, CAC, and confidence metrics.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- campaign_id

## Outputs

- attribution_results
- confidence_score

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

- [cost_revenue_matching](/workflow/cost-revenue-matching.md)
- [attribution_modeling](/workflow/attribution-modeling.md)

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)
- [Analyze campaign CAM-2024-Q2-LinkedIn for true ROI: what was spent, how many leads, which ones became opportunities, and what is the actual CAC after multi-touch weighting?](/tests/single-campaign-deep-dive.md)
- [Our Salesforce data for May had a sync error and we lost 40% of the opportunity records. Can you still generate this month's ROI narrative?](/tests/low-confidence-attribution-refusal.md)

## Evidence emitted

- sql_result

## Required inputs

- campaign_id

## Produces

- attribution_results
- confidence_score

# Examples

```
query_bigquery_attribution_results(campaign_id=<campaign_id>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
