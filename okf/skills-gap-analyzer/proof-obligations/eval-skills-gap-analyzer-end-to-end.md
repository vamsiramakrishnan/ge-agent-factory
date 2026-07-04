---
type: Proof Obligation
title: "Golden eval obligation — Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-skills-gap-analyzer-end-to-end"
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

# Golden eval obligation — Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [skills-gap-analyzer-end-to-end](/tests/skills-gap-analyzer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_skills_gap_analyzer_policy_handbook](/tools/lookup-skills-gap-analyzer-policy-handbook.md)

## Entities that must be referenced

- employees
- skills_db_records
- lms_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [skills-gap-analyzer-policy-handbook](/documents/skills-gap-analyzer-policy-handbook.md)
