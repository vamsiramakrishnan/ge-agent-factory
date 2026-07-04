---
type: Eval Scenario
title: "Run the Attrition Prediction & Intervention workflow for the current period. ..."
description: "Run the Attrition Prediction & Intervention workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "attrition-prediction-intervention-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Attrition Prediction & Intervention workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [risk-stratification](/queries/risk-stratification.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_google_cloud_ai_billing_records](/tools/query-google-cloud-ai-billing-records.md)
- [lookup_attrition_prediction_intervention_policy_handbook](/tools/lookup-attrition-prediction-intervention-policy-handbook.md)
- [action_workday_draft](/tools/action-workday-draft.md)

## Success rubric

Action draft executed against Workday, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Attrition Prediction & Intervention Policy Handbook](/documents/attrition-prediction-intervention-policy-handbook.md)
