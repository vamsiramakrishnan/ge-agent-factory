---
type: Query Capability
title: "Monitor Airflow DAG executions, dbt model runs, and BigQuery table freshness...."
description: "Monitor Airflow DAG executions, dbt model runs, and BigQuery table freshness. Detect failures, timeouts, and data quality violations in real time."
source_id: "failure-detection-alerting"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor Airflow DAG executions, dbt model runs, and BigQuery table freshness. Detect failures, timeouts, and data quality violations in real time.

## Tools used

- [query_apache_airflow_apache_airflow_records](/tools/query-apache-airflow-apache-airflow-records.md)
- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)

## Runs in

- [failure_detection_alerting](/workflow/failure-detection-alerting.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-pipeline-health-monitor-end-to-end.md)

# Citations

- [Data Pipeline Health Monitor Operations Runbook](/documents/data-pipeline-health-monitor-runbook.md)
