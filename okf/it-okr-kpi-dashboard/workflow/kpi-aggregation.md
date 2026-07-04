---
type: Workflow Stage
title: KPI Aggregation
description: "Aggregate KPIs from ServiceNow (ITSM), Jira (DevOps velocity), Datadog (infrastructure), and cloud platforms (cost). Normalize metrics into a unified performance dataset."
source_id: kpi_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# KPI Aggregation

Aggregate KPIs from ServiceNow (ITSM), Jira (DevOps velocity), Datadog (infrastructure), and cloud platforms (cost). Normalize metrics into a unified performance dataset.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_jira_generate](/tools/action-jira-generate.md)

Next: [Performance Narrative](/workflow/performance-narrative.md)
