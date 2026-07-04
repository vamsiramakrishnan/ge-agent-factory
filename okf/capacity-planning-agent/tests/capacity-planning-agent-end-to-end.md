---
type: Eval Scenario
title: Run the Capacity Planning Agent workflow for the current period. Cite the rel...
description: "Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "capacity-planning-agent-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [utilization-collection](/queries/utilization-collection.md)

## Mechanisms to call

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_cloudwatch_billing_records](/tools/query-aws-cloudwatch-billing-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_capacity_planning_agent_runbook](/tools/lookup-capacity-planning-agent-runbook.md)
- [action_kubernetes_trigger](/tools/action-kubernetes-trigger.md)

## Success rubric

Action trigger executed against Kubernetes, with audit-trail entry and Cloud Architect / SRE Manager notified of outcomes.

# Citations

- [Capacity Planning Agent Operations Runbook](/documents/capacity-planning-agent-runbook.md)
