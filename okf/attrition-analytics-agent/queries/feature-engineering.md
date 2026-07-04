---
type: Query Capability
title: "Aggregate multi-dimensional workforce signals from Workday — tenure, performa..."
description: "Aggregate multi-dimensional workforce signals from Workday — tenure, performance, compensation, engagement, manager quality, and career progression. Build feature set for predictive modeling."
source_id: "feature-engineering"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate multi-dimensional workforce signals from Workday — tenure, performance, compensation, engagement, manager quality, and career progression. Build feature set for predictive modeling.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_compensation](/tools/query-workday-compensation.md)
- [query_culture_amp_engagement_scores](/tools/query-culture-amp-engagement-scores.md)
- [evidence_attrition_modeling_methodology](/tools/evidence-attrition-modeling-methodology.md)
- [evidence_manager_intervention_playbook](/tools/evidence-manager-intervention-playbook.md)

## Runs in

- [feature_engineering](/workflow/feature-engineering.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Analyze attrition risk for the Finance team (25 employees) over Q2 2025 and publish a Looker dashboard with risk heatmap and prior intervention ROI.](/tests/team-heatmap-with-intervention-roi.md)
- [Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.](/tests/individual-risk-with-root-cause-and-recommendation.md)
- [Generate attrition predictions for all 500 Finance employees. The model flags a statistically significant interaction between gender and promotion history in the feature importance.](/tests/fairness-flag-escalation.md)

# Citations

- [Attrition Prediction Model Methodology & Fairness Audit](/documents/attrition-modeling-methodology.md)
- [Manager Intervention Playbook for High-Risk Attrition Scenarios](/documents/manager-intervention-playbook.md)
