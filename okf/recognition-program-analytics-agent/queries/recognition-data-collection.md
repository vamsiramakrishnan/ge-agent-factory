---
type: Query Capability
title: Aggregate all recognition events from Bonusly/Achievers with sender/receiver ...
description: Aggregate all recognition events from Bonusly/Achievers with sender/receiver metadata. Enrich with Workday demographics for equity analysis across dimensions.
source_id: "recognition-data-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate all recognition events from Bonusly/Achievers with sender/receiver metadata. Enrich with Workday demographics for equity analysis across dimensions.

## Tools used

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_recognition_program_analytics_agent_policy_handbook](/tools/lookup-recognition-program-analytics-agent-policy-handbook.md)
- [action_recognition_platform_execute](/tools/action-recognition-platform-execute.md)

## Runs in

- [recognition_data_collection](/workflow/recognition-data-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Recognition Program Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-program-analytics-agent-end-to-end.md)

# Citations

- [Recognition Program Analytics Agent Policy Handbook](/documents/recognition-program-analytics-agent-policy-handbook.md)
