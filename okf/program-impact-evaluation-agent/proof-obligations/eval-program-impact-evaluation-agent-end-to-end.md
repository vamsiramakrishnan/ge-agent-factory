---
type: Proof Obligation
title: "Golden eval obligation — Run the Program Impact Evaluation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-program-impact-evaluation-agent-end-to-end"
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

# Golden eval obligation — Run the Program Impact Evaluation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [program-impact-evaluation-agent-end-to-end](/tests/program-impact-evaluation-agent-end-to-end.md)


## Mechanisms

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_program_impact_evaluation_agent_policy_handbook](/tools/lookup-program-impact-evaluation-agent-policy-handbook.md)

## Entities that must be referenced

- lms_records
- employees
- survey_platform_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [program-impact-evaluation-agent-policy-handbook](/documents/program-impact-evaluation-agent-policy-handbook.md)
