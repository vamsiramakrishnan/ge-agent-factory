---
type: Workflow Stage
title: "Scenario & Role Mapping"
description: Ingest restructuring scenario parameters from Workday. Map current roles to proposed structure using enterprise skills taxonomy in BigQuery.
source_id: scenario_role_mapping
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scenario & Role Mapping

Ingest restructuring scenario parameters from Workday. Map current roles to proposed structure using enterprise skills taxonomy in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_restructuring_impact_assessment_agent_policy_handbook](/tools/lookup-restructuring-impact-assessment-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

Next: [Impact Quantification](/workflow/impact-quantification.md)
