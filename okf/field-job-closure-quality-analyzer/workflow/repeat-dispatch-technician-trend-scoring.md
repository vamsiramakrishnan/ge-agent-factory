---
type: Workflow Stage
title: "Repeat-Dispatch & Technician Trend Scoring"
description: "Compare repeat_within_30d flags and technician_schedules assignments against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_analytics_events to score technician and crew closure-quality trends and prioritize the Field Quality Auditor's queue."
source_id: repeat_dispatch_technician_trend_scoring
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Repeat-Dispatch & Technician Trend Scoring

Compare repeat_within_30d flags and technician_schedules assignments against historical_metrics and analytics_events baselines in BigQuery via query_bigquery_analytics_events to score technician and crew closure-quality trends and prioritize the Field Quality Auditor's queue.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)
- [action_oracle_field_service_recommend](/tools/action-oracle-field-service-recommend.md)

Next: [As-Built Reconciliation](/workflow/as-built-reconciliation.md)
