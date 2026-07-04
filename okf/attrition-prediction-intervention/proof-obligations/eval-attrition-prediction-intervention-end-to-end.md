---
type: Proof Obligation
title: "Golden eval obligation — Run the Attrition Prediction & Intervention workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-attrition-prediction-intervention-end-to-end"
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

# Golden eval obligation — Run the Attrition Prediction & Intervention workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [attrition-prediction-intervention-end-to-end](/tests/attrition-prediction-intervention-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_google_cloud_ai_billing_records](/tools/query-google-cloud-ai-billing-records.md)
- [lookup_attrition_prediction_intervention_policy_handbook](/tools/lookup-attrition-prediction-intervention-policy-handbook.md)
- [action_workday_draft](/tools/action-workday-draft.md)

## Entities that must be referenced

- employees
- analytics_events
- engagement_surveys
- billing_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute draft without two-system evidence

# Citations

- [attrition-prediction-intervention-policy-handbook](/documents/attrition-prediction-intervention-policy-handbook.md)
