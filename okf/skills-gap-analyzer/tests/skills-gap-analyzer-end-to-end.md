---
type: Eval Scenario
title: Run the Skills Gap Analyzer workflow for the current period. Cite the relevan...
description: "Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "skills-gap-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Skills Gap Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [skills-inventory-assembly](/queries/skills-inventory-assembly.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_skills_gap_analyzer_policy_handbook](/tools/lookup-skills-gap-analyzer-policy-handbook.md)

## Success rubric

L&D Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Skills Gap Analyzer Policy Handbook](/documents/skills-gap-analyzer-policy-handbook.md)
