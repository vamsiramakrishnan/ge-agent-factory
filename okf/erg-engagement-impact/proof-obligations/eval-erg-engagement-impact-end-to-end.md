---
type: Proof Obligation
title: "Golden eval obligation — Run the ERG Engagement & Impact workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-erg-engagement-impact-end-to-end"
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

# Golden eval obligation — Run the ERG Engagement & Impact workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [erg-engagement-impact-end-to-end](/tests/erg-engagement-impact-end-to-end.md)


## Mechanisms

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_erg_engagement_impact_policy_handbook](/tools/lookup-erg-engagement-impact-policy-handbook.md)

## Entities that must be referenced

- recognition_platform_records
- employees
- analytics_events
- survey_platform_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [erg-engagement-impact-policy-handbook](/documents/erg-engagement-impact-policy-handbook.md)
