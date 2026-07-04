---
type: Eval Scenario
title: Run the Engineering Change Backlog Analyzer workflow for the current period. ...
description: "Run the Engineering Change Backlog Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "engineering-change-backlog-analyzer-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Engineering Change Backlog Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)
- [action_ptc_windchill_plm_draft](/tools/action-ptc-windchill-plm-draft.md)

## Success rubric

Action draft executed against PTC Windchill PLM, with audit-trail entry and Design Engineer notified of outcomes.

# Citations

- [Engineering Change Backlog Analyzer Standard Operating Procedure](/documents/engineering-change-backlog-analyzer-sop.md)
