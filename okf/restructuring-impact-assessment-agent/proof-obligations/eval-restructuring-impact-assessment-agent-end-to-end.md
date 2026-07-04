---
type: Proof Obligation
title: "Golden eval obligation — Run the Restructuring Impact Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-restructuring-impact-assessment-agent-end-to-end"
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

# Golden eval obligation — Run the Restructuring Impact Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [restructuring-impact-assessment-agent-end-to-end](/tests/restructuring-impact-assessment-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_restructuring_impact_assessment_agent_policy_handbook](/tools/lookup-restructuring-impact-assessment-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Entities that must be referenced

- employees
- employee_records
- skills_db_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [restructuring-impact-assessment-agent-policy-handbook](/documents/restructuring-impact-assessment-agent-policy-handbook.md)
