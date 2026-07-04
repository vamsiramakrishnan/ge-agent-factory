---
type: Proof Obligation
title: Golden eval obligation — Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.
description: golden eval proof obligation
source_id: "eval-team-heatmap-with-intervention-roi"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [team-heatmap-with-intervention-roi](/tests/team-heatmap-with-intervention-roi.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_culture_amp_engagement_scores](/tools/query-culture-amp-engagement-scores.md)
- [query_bigquery_attrition_features](/tools/query-bigquery-attrition-features.md)
- [query_bigquery_intervention_history](/tools/query-bigquery-intervention-history.md)
- [evidence_attrition_modeling_methodology](/tools/evidence-attrition-modeling-methodology.md)
- [action_looker_publish_attrition_dashboard](/tools/action-looker-publish-attrition-dashboard.md)

## Entities that must be referenced

- employees
- engagement_responses
- attrition_predictions
- interventions

## Forbidden behaviors

- do not expose individual names or risk scores in team view
- do not invent intervention outcomes without historical data

# Citations

- [attrition-modeling-methodology](/documents/attrition-modeling-methodology.md)
