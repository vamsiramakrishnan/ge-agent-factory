---
type: Query Capability
title: "Pull resource utilization from Kubernetes clusters, Datadog APM, AWS CloudWat..."
description: "Pull resource utilization from Kubernetes clusters, Datadog APM, AWS CloudWatch, and GCP Monitoring. Aggregate CPU, memory, storage, and network at the service and cluster level."
source_id: "utilization-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull resource utilization from Kubernetes clusters, Datadog APM, AWS CloudWatch, and GCP Monitoring. Aggregate CPU, memory, storage, and network at the service and cluster level.

## Tools used

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_aws_cloudwatch_billing_records](/tools/query-aws-cloudwatch-billing-records.md)
- [lookup_capacity_planning_agent_runbook](/tools/lookup-capacity-planning-agent-runbook.md)
- [action_kubernetes_trigger](/tools/action-kubernetes-trigger.md)

## Runs in

- [utilization_collection](/workflow/utilization-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Capacity Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capacity-planning-agent-end-to-end.md)

# Citations

- [Capacity Planning Agent Operations Runbook](/documents/capacity-planning-agent-runbook.md)
