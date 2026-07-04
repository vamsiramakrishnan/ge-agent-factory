---
type: Source System
title: ArgoCD
description: "Deployment frequency, sync status, rollback events"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ArgoCD

Deployment frequency, sync status, rollback events

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [pipeline_runs](/tables/pipeline-runs.md)
- [deployments](/tables/deployments.md)
- [test_results](/tables/test-results.md)

## Tools using this system

- [query_argocd_pipeline_runs](/tools/query-argocd-pipeline-runs.md)
