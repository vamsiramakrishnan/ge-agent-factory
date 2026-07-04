---
type: Proof Obligation
title: "Golden eval obligation — Run the Problem Management Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-problem-management-analyzer-end-to-end"
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

# Golden eval obligation — Run the Problem Management Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [problem-management-analyzer-end-to-end](/tests/problem-management-analyzer-end-to-end.md)


## Mechanisms

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_problem_management_analyzer_runbook](/tools/lookup-problem-management-analyzer-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Entities that must be referenced

- tickets
- analytics_events
- alerts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [problem-management-analyzer-runbook](/documents/problem-management-analyzer-runbook.md)
