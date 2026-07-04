---
type: Proof Obligation
title: "Golden eval obligation — Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-kubernetes-cluster-optimizer-end-to-end"
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

# Golden eval obligation — Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [kubernetes-cluster-optimizer-end-to-end](/tests/kubernetes-cluster-optimizer-end-to-end.md)


## Mechanisms

- [query_kubernetes_workloads](/tools/query-kubernetes-workloads.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_kubernetes_cluster_optimizer_runbook](/tools/lookup-kubernetes-cluster-optimizer-runbook.md)

## Entities that must be referenced

- workloads
- alerts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [kubernetes-cluster-optimizer-runbook](/documents/kubernetes-cluster-optimizer-runbook.md)
