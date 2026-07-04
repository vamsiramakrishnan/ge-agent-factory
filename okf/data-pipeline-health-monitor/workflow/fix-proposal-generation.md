---
type: Workflow Stage
title: Fix Proposal Generation
description: "Gemini generates a concrete fix proposal based on root cause. For schema changes: generate dbt model update. For data issues: suggest default values or filtering. Assesses downstream impact of the fix."
source_id: fix_proposal_generation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Fix Proposal Generation

Gemini generates a concrete fix proposal based on root cause. For schema changes: generate dbt model update. For data issues: suggest default values or filtering. Assesses downstream impact of the fix.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)

Next: [Fix Deployment & Verification](/workflow/fix-deployment-verification.md)
