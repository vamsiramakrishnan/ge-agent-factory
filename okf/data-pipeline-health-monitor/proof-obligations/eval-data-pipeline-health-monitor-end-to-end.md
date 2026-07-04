---
type: Proof Obligation
title: "Golden eval obligation — Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-data-pipeline-health-monitor-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Data Pipeline Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [data-pipeline-health-monitor-end-to-end](/tests/data-pipeline-health-monitor-end-to-end.md)


## Mechanisms

- [query_apache_airflow_apache_airflow_records](/tools/query-apache-airflow-apache-airflow-records.md)
- [query_dbt_dbt_records](/tools/query-dbt-dbt-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_data_pipeline_health_monitor_runbook](/tools/lookup-data-pipeline-health-monitor-runbook.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)

## Entities that must be referenced

- apache_airflow_records
- dbt_records
- analytics_events
- alerts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [data-pipeline-health-monitor-runbook](/documents/data-pipeline-health-monitor-runbook.md)
