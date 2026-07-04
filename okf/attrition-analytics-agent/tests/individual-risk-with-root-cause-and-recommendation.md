---
type: Eval Scenario
title: Compute flight risk for a Finance analyst with low engagement trend and 18 mo...
description: Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.
source_id: "individual-risk-with-root-cause-and-recommendation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compute flight risk for a Finance analyst with low engagement trend and 18 months tenure. Identify root cause and recommend an intervention.

## Validates

- [feature-engineering](/queries/feature-engineering.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_workday_compensation](/tools/query-workday-compensation.md)
- [query_culture_amp_engagement_scores](/tools/query-culture-amp-engagement-scores.md)
- [query_bigquery_attrition_features](/tools/query-bigquery-attrition-features.md)
- [query_bigquery_intervention_history](/tools/query-bigquery-intervention-history.md)
- [evidence_attrition_modeling_methodology](/tools/evidence-attrition-modeling-methodology.md)
- [evidence_manager_intervention_playbook](/tools/evidence-manager-intervention-playbook.md)

## Success rubric

Risk score cited with feature importance, root cause linked to engagement theme + compensation gap, intervention recommended with ROI estimate.

# Citations

- [Attrition Prediction Model Methodology & Fairness Audit](/documents/attrition-modeling-methodology.md)
- [Manager Intervention Playbook for High-Risk Attrition Scenarios](/documents/manager-intervention-playbook.md)
