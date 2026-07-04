---
type: Source System
title: Kubernetes
description: "Pod status, restart history, resource consumption"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Kubernetes

Pod status, restart history, resource consumption

- **Protocol:** Kubernetes API
- **Local backing:** json-api, alloydb

# Schema

- [services](/tables/services.md)
- [remediation_executions](/tables/remediation-executions.md)

## Tools using this system

- [query_kubernetes_pod_status](/tools/query-kubernetes-pod-status.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_kubernetes_restart_pod](/tools/action-kubernetes-restart-pod.md)
