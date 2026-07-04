---
type: Query Capability
title: Analyze Kubernetes cluster resource allocation — pod requests vs. actual usag...
description: "Analyze Kubernetes cluster resource allocation — pod requests vs. actual usage from Datadog. Map node utilization, scheduling efficiency, and over-provisioning patterns across all clusters."
source_id: "cluster-resource-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze Kubernetes cluster resource allocation — pod requests vs. actual usage from Datadog. Map node utilization, scheduling efficiency, and over-provisioning patterns across all clusters.

## Tools used

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_kubernetes_cluster_optimizer_runbook](/tools/lookup-kubernetes-cluster-optimizer-runbook.md)

## Runs in

- [cluster_resource_analysis](/workflow/cluster-resource-analysis.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/kubernetes-cluster-optimizer-end-to-end.md)

# Citations

- [Kubernetes Cluster Optimizer Operations Runbook](/documents/kubernetes-cluster-optimizer-runbook.md)
