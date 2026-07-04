---
type: Proof Obligation
title: "Golden eval obligation — Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-database-performance-advisor-end-to-end"
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

# Golden eval obligation — Run the Database Performance Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [database-performance-advisor-end-to-end](/tests/database-performance-advisor-end-to-end.md)


## Mechanisms

- [query_cloudsql_cloudsql_records](/tools/query-cloudsql-cloudsql-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_database_performance_advisor_runbook](/tools/lookup-database-performance-advisor-runbook.md)
- [action_cloudsql_create](/tools/action-cloudsql-create.md)

## Entities that must be referenced

- cloudsql_records
- analytics_events
- alerts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute create without two-system evidence

# Citations

- [database-performance-advisor-runbook](/documents/database-performance-advisor-runbook.md)
