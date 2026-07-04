---
type: Query Capability
title: Ingest restructuring scenario parameters from Workday. Map current roles to p...
description: Ingest restructuring scenario parameters from Workday. Map current roles to proposed structure using enterprise skills taxonomy in BigQuery.
source_id: "scenario-role-mapping"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest restructuring scenario parameters from Workday. Map current roles to proposed structure using enterprise skills taxonomy in BigQuery.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_restructuring_impact_assessment_agent_policy_handbook](/tools/lookup-restructuring-impact-assessment-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Runs in

- [scenario_role_mapping](/workflow/scenario-role-mapping.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Restructuring Impact Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/restructuring-impact-assessment-agent-end-to-end.md)

# Citations

- [Restructuring Impact Assessment Agent Policy Handbook](/documents/restructuring-impact-assessment-agent-policy-handbook.md)
