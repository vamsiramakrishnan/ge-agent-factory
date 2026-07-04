---
type: Eval Scenario
title: Run the Learning Path Recommendation workflow for the current period. Cite th...
description: "Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "learning-path-recommendation-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [path-curation](/queries/path-curation.md)

## Mechanisms to call

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_udemy_udemy_records](/tools/query-udemy-udemy-records.md)
- [query_coursera_coursera_records](/tools/query-coursera-coursera-records.md)
- [lookup_learning_path_recommendation_policy_handbook](/tools/lookup-learning-path-recommendation-policy-handbook.md)
- [action_lms_recommend](/tools/action-lms-recommend.md)

## Success rubric

Action recommend executed against LMS, with audit-trail entry and Employee notified of outcomes.

# Citations

- [Learning Path Recommendation Policy Handbook](/documents/learning-path-recommendation-policy-handbook.md)
