---
type: Eval Scenario
title: Run the Kubernetes Cluster Optimizer workflow for the current period. Cite th...
description: "Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "kubernetes-cluster-optimizer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cluster-resource-analysis](/queries/cluster-resource-analysis.md)

## Mechanisms to call

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_kubernetes_cluster_optimizer_runbook](/tools/lookup-kubernetes-cluster-optimizer-runbook.md)

## Success rubric

SRE Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Kubernetes Cluster Optimizer Operations Runbook](/documents/kubernetes-cluster-optimizer-runbook.md)
