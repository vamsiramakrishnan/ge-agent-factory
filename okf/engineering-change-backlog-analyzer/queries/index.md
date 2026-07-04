---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query engineering_change_orders and cad_document_records from PTC Windchill PLM via query_ptc_windchill_plm_engineering_change_orders and query_ptc_windchill_plm_cad_document_records, then correlate against Jira issues and epics (query_jira_issues, query_jira_epics) to cluster requests against the same affected part and merge duplicates.](/queries/backlog-ingestion-duplicate-clustering.md)
- [Cross-reference bom_revisions parent_material_number and effectivity_type (serial_number, date, lot, immediate_use_up) from PTC Windchill PLM against each clustered engineering_change_orders record to detect cut-in conflicts before any request advances toward the agenda.](/queries/effectivity-configuration-conflict-check.md)
- [Score each clustered request on cost impact, quality risk, and affected_item_count using historical_metrics and analytics_events pulled from BigQuery via query_bigquery_historical_metrics and query_bigquery_analytics_events, benchmarked against the Open change requests older than 90 days and duplicate-rate KPI baselines.](/queries/cost-quality-volume-impact-scoring.md)
- [Invoke lookup_engineering_change_backlog_analyzer_sop to cite the governing SOP sections, and check export_controlled and itar_restricted flags on engineering_change_orders and cad_document_records against the Technology Control Plan before any finding is narrated.](/queries/sop-export-control-evidence-validation.md)
- [Call action_ptc_windchill_plm_draft to publish the ranked, one-paragraph-per-request change board agenda in PTC Windchill PLM with a full audit trail, escalating gated items to the Design Engineer, chief_engineer, change_analyst, or empowered_official as required.](/queries/change-board-agenda-drafting-audit.md)
