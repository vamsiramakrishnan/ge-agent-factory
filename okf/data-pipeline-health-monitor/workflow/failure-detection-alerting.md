---
type: Workflow Stage
title: "Failure Detection & Alerting"
description: "Monitor Airflow DAG executions, dbt model runs, and BigQuery table freshness. Detect failures, timeouts, and data quality violations in real time."
source_id: failure_detection_alerting
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Failure Detection & Alerting

Monitor Airflow DAG executions, dbt model runs, and BigQuery table freshness. Detect failures, timeouts, and data quality violations in real time.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_apache_airflow_apache_airflow_records](/tools/query-apache-airflow-apache-airflow-records.md)
- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)

Next: [Root Cause Analysis](/workflow/root-cause-analysis.md)
