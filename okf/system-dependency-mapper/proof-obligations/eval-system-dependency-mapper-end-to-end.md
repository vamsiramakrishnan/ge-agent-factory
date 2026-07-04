---
type: Proof Obligation
title: "Golden eval obligation — Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-system-dependency-mapper-end-to-end"
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

# Golden eval obligation — Run the System Dependency Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [system-dependency-mapper-end-to-end](/tests/system-dependency-mapper-end-to-end.md)


## Mechanisms

- [query_datadog_apm_alerts](/tools/query-datadog-apm-alerts.md)
- [query_servicenow_cmdb_tickets](/tools/query-servicenow-cmdb-tickets.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_system_dependency_mapper_runbook](/tools/lookup-system-dependency-mapper-runbook.md)
- [action_servicenow_cmdb_recommend](/tools/action-servicenow-cmdb-recommend.md)

## Entities that must be referenced

- alerts
- tickets
- pull_requests
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [system-dependency-mapper-runbook](/documents/system-dependency-mapper-runbook.md)
