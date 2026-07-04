---
type: Query Capability
title: "Aggregate ERG membership, event participation, and Slack channel activity. Li..."
description: "Aggregate ERG membership, event participation, and Slack channel activity. Link to Workday employee records for retention and engagement correlation."
source_id: "activity-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate ERG membership, event participation, and Slack channel activity. Link to Workday employee records for retention and engagement correlation.

## Tools used

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_erg_engagement_impact_policy_handbook](/tools/lookup-erg-engagement-impact-policy-handbook.md)

## Runs in

- [activity_data_aggregation](/workflow/activity-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the ERG Engagement & Impact workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/erg-engagement-impact-end-to-end.md)

# Citations

- [ERG Engagement & Impact Policy Handbook](/documents/erg-engagement-impact-policy-handbook.md)
