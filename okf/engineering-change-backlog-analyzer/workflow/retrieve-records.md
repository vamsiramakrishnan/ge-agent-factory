---
type: Workflow Stage
title: Retrieve Records
description: Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with Jira for the Engineering Change Backlog Analyzer workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query engineering change orders and bom revisions from PTC Windchill PLM and correlate with Jira for the Engineering Change Backlog Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)
- [action_ptc_windchill_plm_draft](/tools/action-ptc-windchill-plm-draft.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
