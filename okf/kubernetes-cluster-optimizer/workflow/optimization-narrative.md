---
type: Workflow Stage
title: Optimization Narrative
description: "Gemini explains: 'Cluster prod-east has 40% memory over-provisioned — pods request 2Gi but use 1.1Gi at p99. Reducing requests to 1.5Gi would consolidate from 12 nodes to 8, saving $3,400/month.'"
source_id: optimization_narrative
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Optimization Narrative

Gemini explains: 'Cluster prod-east has 40% memory over-provisioned — pods request 2Gi but use 1.1Gi at p99. Reducing requests to 1.5Gi would consolidate from 12 nodes to 8, saving $3,400/month.'

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [lookup_kubernetes_cluster_optimizer_runbook](/tools/lookup-kubernetes-cluster-optimizer-runbook.md)

Next: [GitOps Application](/workflow/git-ops-application.md)
