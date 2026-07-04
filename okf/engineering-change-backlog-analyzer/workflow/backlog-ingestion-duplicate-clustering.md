---
type: Workflow Stage
title: "Backlog Ingestion & Duplicate Clustering"
description: "Query engineering_change_orders and cad_document_records from PTC Windchill PLM via query_ptc_windchill_plm_engineering_change_orders and query_ptc_windchill_plm_cad_document_records, then correlate against Jira issues and epics (query_jira_issues, query_jira_epics) to cluster requests against the same affected part and merge duplicates."
source_id: backlog_ingestion_duplicate_clustering
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Backlog Ingestion & Duplicate Clustering

Query engineering_change_orders and cad_document_records from PTC Windchill PLM via query_ptc_windchill_plm_engineering_change_orders and query_ptc_windchill_plm_cad_document_records, then correlate against Jira issues and epics (query_jira_issues, query_jira_epics) to cluster requests against the same affected part and merge duplicates.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)
- [action_ptc_windchill_plm_draft](/tools/action-ptc-windchill-plm-draft.md)

Next: [Effectivity & Configuration Conflict Check](/workflow/effectivity-configuration-conflict-check.md)
