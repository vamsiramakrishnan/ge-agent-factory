---
type: Workflow Stage
title: "Multi-Source Discovery"
description: "Collect service-to-service call data from Datadog APM traces, declared relationships from CMDB, and code-level dependency declarations from GitHub. Merge into a unified graph."
source_id: multi_source_discovery
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-Source Discovery

Collect service-to-service call data from Datadog APM traces, declared relationships from CMDB, and code-level dependency declarations from GitHub. Merge into a unified graph.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_datadog_apm_alerts](/tools/query-datadog-apm-alerts.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_system_dependency_mapper_runbook](/tools/lookup-system-dependency-mapper-runbook.md)
- [action_servicenow_cmdb_recommend](/tools/action-servicenow-cmdb-recommend.md)

Next: [Graph Analytics](/workflow/graph-analytics.md)
