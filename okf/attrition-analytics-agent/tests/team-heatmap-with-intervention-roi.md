---
type: Eval Scenario
title: Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and p...
description: Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.
source_id: "team-heatmap-with-intervention-roi"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.

## Validates

- [feature-engineering](/queries/feature-engineering.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_culture_amp_engagement_scores](/tools/query-culture-amp-engagement-scores.md)
- [query_bigquery_attrition_features](/tools/query-bigquery-attrition-features.md)
- [query_bigquery_intervention_history](/tools/query-bigquery-intervention-history.md)
- [evidence_attrition_modeling_methodology](/tools/evidence-attrition-modeling-methodology.md)
- [action_looker_publish_attrition_dashboard](/tools/action-looker-publish-attrition-dashboard.md)

## Success rubric

Dashboard published to Looker with team risk heatmap, intervention history, and ROI metrics.

# Citations

- [Attrition Prediction Model Methodology & Fairness Audit](/documents/attrition-modeling-methodology.md)
