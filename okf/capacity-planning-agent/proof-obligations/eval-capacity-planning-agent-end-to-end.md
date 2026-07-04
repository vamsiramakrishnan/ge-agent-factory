---
type: Proof Obligation
title: "Golden eval obligation — Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-capacity-planning-agent-end-to-end"
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

# Golden eval obligation — Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [capacity-planning-agent-end-to-end](/tests/capacity-planning-agent-end-to-end.md)


## Mechanisms

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_cloudwatch_billing_records](/tools/query-aws-cloudwatch-billing-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capacity_planning_agent_runbook](/tools/lookup-capacity-planning-agent-runbook.md)
- [action_kubernetes_trigger](/tools/action-kubernetes-trigger.md)

## Entities that must be referenced

- workloads
- alerts
- billing_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute trigger without two-system evidence

# Citations

- [capacity-planning-agent-runbook](/documents/capacity-planning-agent-runbook.md)
