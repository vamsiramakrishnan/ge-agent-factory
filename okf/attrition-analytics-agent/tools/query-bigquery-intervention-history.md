---
type: Agent Tool
title: query_bigquery_intervention_history
description: Look up historical interventions and outcomes to calculate ROI and recommend actions with proven effectiveness.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_intervention_history

Look up historical interventions and outcomes to calculate ROI and recommend actions with proven effectiveness.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- intervention_type
- date_range

## Outputs

- intervention_records
- retention_uplift
- cost_per_retention

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

- [intervention_dashboard](/workflow/intervention-dashboard.md)

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)
- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)

## Evidence emitted

- sql_result

## Required inputs

- intervention_type
- date_range

## Produces

- intervention_records
- retention_uplift
- cost_per_retention

# Examples

```
query_bigquery_intervention_history(intervention_type=<intervention_type>, date_range=<date_range>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
