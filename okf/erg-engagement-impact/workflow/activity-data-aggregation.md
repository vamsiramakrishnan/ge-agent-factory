---
type: Workflow Stage
title: Activity Data Aggregation
description: "Aggregate ERG membership, event participation, and Slack channel activity. Link to Workday employee records for retention and engagement correlation."
source_id: activity_data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Activity Data Aggregation

Aggregate ERG membership, event participation, and Slack channel activity. Link to Workday employee records for retention and engagement correlation.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_erg_engagement_impact_policy_handbook](/tools/lookup-erg-engagement-impact-policy-handbook.md)

Next: [Impact Correlation](/workflow/impact-correlation.md)
