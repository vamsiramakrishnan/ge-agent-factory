---
type: Eval Scenario
title: Run the Data Pipeline Health Monitor workflow for the current period. Cite th...
description: "Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "data-pipeline-health-monitor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [failure-detection-alerting](/queries/failure-detection-alerting.md)

## Mechanisms to call

- [query_apache_airflow_apache_airflow_records](/tools/query-apache-airflow-apache-airflow-records.md)
- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)

## Success rubric

Action generate executed against Apache Airflow, with audit-trail entry and Data Platform Lead notified of outcomes.

# Citations

- [Data Pipeline Health Monitor Operations Runbook](/documents/data-pipeline-health-monitor-runbook.md)
