---
type: Agent Tool
title: query_kubernetes_pod_status
description: "Check pod restart count, resource limits, and deployment version to detect repeated failures."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_kubernetes_pod_status

Check pod restart count, resource limits, and deployment version to detect repeated failures.

- **Kind:** query
- **Source system:** [Kubernetes](/systems/kubernetes.md)

## Inputs

- pod_name
- namespace

## Outputs

- pod_state
- restart_history

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kubernetes](/systems/kubernetes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [execution_verification](/workflow/execution-verification.md)

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)

## Evidence emitted

- source_system_record

## Required inputs

- pod_name
- namespace

## Produces

- pod_state
- restart_history

# Examples

```
query_kubernetes_pod_status(pod_name=<pod_name>, namespace=<namespace>)
```

# Citations

- [Kubernetes](/systems/kubernetes.md)
