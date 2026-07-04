---
type: Proof Obligation
title: "Golden eval obligation — Run the Successor Readiness Assessment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-successor-readiness-assessment-end-to-end"
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

# Golden eval obligation — Run the Successor Readiness Assessment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [successor-readiness-assessment-end-to-end](/tests/successor-readiness-assessment-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_assessment_platform_assessment_platform_records](/tools/query-assessment-platform-assessment-platform-records.md)
- [lookup_successor_readiness_assessment_policy_handbook](/tools/lookup-successor-readiness-assessment-policy-handbook.md)

## Entities that must be referenced

- employees
- analytics_events
- assessment_platform_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [successor-readiness-assessment-policy-handbook](/documents/successor-readiness-assessment-policy-handbook.md)
