---
type: Query Capability
title: "Run multi-variable attrition prediction model scoring individual and team-lev..."
description: "Run multi-variable attrition prediction model scoring individual and team-level flight risk. Identify leading indicators with feature importance ranking."
source_id: "predictive-modeling"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run multi-variable attrition prediction model scoring individual and team-level flight risk. Identify leading indicators with feature importance ranking.

## Tools used

- [query_bigquery_attrition_features](/tools/query-bigquery-attrition-features.md)
- [action_looker_publish_attrition_dashboard](/tools/action-looker-publish-attrition-dashboard.md)
- [evidence_attrition_modeling_methodology](/tools/evidence-attrition-modeling-methodology.md)

## Runs in

- [predictive_modeling](/workflow/predictive-modeling.md)

## Evidence expected

- sql_result
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)
- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)
- [Generate attrition predictions for all 500 Finance employees. The model flags a statistically significant interaction between gender and promotion history in the feature importance.](/tests/fairness-flag-escalation.md)

# Citations

- [Attrition Prediction Model Methodology & Fairness Audit](/documents/attrition-modeling-methodology.md)
- [Manager Intervention Playbook for High-Risk Attrition Scenarios](/documents/manager-intervention-playbook.md)
