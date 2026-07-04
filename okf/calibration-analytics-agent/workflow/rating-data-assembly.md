---
type: Workflow Stage
title: Rating Data Assembly
description: "Pull proposed ratings, employee demographics, and manager assignment data from Workday. Combine with historical rating patterns from BigQuery."
source_id: rating_data_assembly
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Rating Data Assembly

Pull proposed ratings, employee demographics, and manager assignment data from Workday. Combine with historical rating patterns from BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_calibration_analytics_agent_policy_handbook](/tools/lookup-calibration-analytics-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

Next: [Calibration Recommendations](/workflow/calibration-recommendations.md)
