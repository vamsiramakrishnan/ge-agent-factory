---
type: Workflow Stage
title: Utilization Collection
description: "Pull resource utilization from Kubernetes clusters, Datadog APM, AWS CloudWatch, and GCP Monitoring. Aggregate CPU, memory, storage, and network at the service and cluster level."
source_id: utilization_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Utilization Collection

Pull resource utilization from Kubernetes clusters, Datadog APM, AWS CloudWatch, and GCP Monitoring. Aggregate CPU, memory, storage, and network at the service and cluster level.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_cloudwatch_billing_records](/tools/query-aws-cloudwatch-billing-records.md)
- [lookup_capacity_planning_agent_runbook](/tools/lookup-capacity-planning-agent-runbook.md)
- [action_kubernetes_trigger](/tools/action-kubernetes-trigger.md)

Next: [Growth Forecasting](/workflow/growth-forecasting.md)
