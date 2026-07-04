---
type: Query Capability
title: "Gemini explains: 'Cluster prod-east has 40% memory over-provisioned — pods re..."
description: "Gemini explains: 'Cluster prod-east has 40% memory over-provisioned — pods request 2Gi but use 1.1Gi at p99. Reducing requests to 1.5Gi would consolidate from 12 nodes to 8, saving $3,400/month.'"
source_id: "optimization-narrative"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini explains: 'Cluster prod-east has 40% memory over-provisioned — pods request 2Gi but use 1.1Gi at p99. Reducing requests to 1.5Gi would consolidate from 12 nodes to 8, saving $3,400/month.'

## Tools used

- [lookup_kubernetes_cluster_optimizer_runbook](/tools/lookup-kubernetes-cluster-optimizer-runbook.md)

## Runs in

- [optimization_narrative](/workflow/optimization-narrative.md)

## Evidence expected

- document_reference

## Evals

- [Run the Kubernetes Cluster Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/kubernetes-cluster-optimizer-end-to-end.md)

# Citations

- [Kubernetes Cluster Optimizer Operations Runbook](/documents/kubernetes-cluster-optimizer-runbook.md)
