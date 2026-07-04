---
type: Agent Tool
title: action_kubernetes_restart_pod
description: "Restart a failing pod after SRE approval, for transient failure or memory leak remediation."
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

# action_kubernetes_restart_pod

Restart a failing pod after SRE approval, for transient failure or memory leak remediation.

- **Kind:** action
- **Source system:** [Kubernetes](/systems/kubernetes.md)
- **API:** POST /systems/kubernetes/pods/{name}/restart

## Inputs

- pod_name
- namespace

## Outputs

- restart_id
- new_pod_status

## Side Effects

- May change Kubernetes state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_kubernetes_restart_pod](/policies/confirmation-action-kubernetes-restart-pod.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kubernetes](/systems/kubernetes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [context_aware_remediation_selection](/workflow/context-aware-remediation-selection.md)
- [execution_verification](/workflow/execution-verification.md)

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)

## Evidence emitted

- api_response

## Required inputs

- pod_name
- namespace

## Produces

- restart_id
- new_pod_status

# Examples

```
action_kubernetes_restart_pod(pod_name=<pod_name>, namespace=<namespace>)
```

# Citations

- [Kubernetes](/systems/kubernetes.md)
- [Confirmation policy — action_kubernetes_restart_pod](/policies/confirmation-action-kubernetes-restart-pod.md)
