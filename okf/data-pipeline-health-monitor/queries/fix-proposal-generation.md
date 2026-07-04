---
type: Query Capability
title: Gemini generates a concrete fix proposal based on root cause. For schema chan...
description: "Gemini generates a concrete fix proposal based on root cause. For schema changes: generate dbt model update. For data issues: suggest default values or filtering. Assesses downstream impact of the fix."
source_id: "fix-proposal-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates a concrete fix proposal based on root cause. For schema changes: generate dbt model update. For data issues: suggest default values or filtering. Assesses downstream impact of the fix.

## Tools used

- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)

## Runs in

- [fix_proposal_generation](/workflow/fix-proposal-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-pipeline-health-monitor-end-to-end.md)

# Citations

- [Data Pipeline Health Monitor Operations Runbook](/documents/data-pipeline-health-monitor-runbook.md)
