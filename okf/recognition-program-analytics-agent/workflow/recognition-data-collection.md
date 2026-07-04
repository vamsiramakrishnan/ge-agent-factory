---
type: Workflow Stage
title: Recognition Data Collection
description: Aggregate all recognition events from Bonusly/Achievers with sender/receiver metadata. Enrich with Workday demographics for equity analysis across dimensions.
source_id: recognition_data_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Recognition Data Collection

Aggregate all recognition events from Bonusly/Achievers with sender/receiver metadata. Enrich with Workday demographics for equity analysis across dimensions.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_recognition_program_analytics_agent_policy_handbook](/tools/lookup-recognition-program-analytics-agent-policy-handbook.md)
- [action_recognition_platform_execute](/tools/action-recognition-platform-execute.md)

Next: [Pattern & Equity Analysis](/workflow/pattern-equity-analysis.md)
