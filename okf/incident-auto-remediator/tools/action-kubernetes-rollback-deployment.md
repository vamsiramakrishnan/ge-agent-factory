---
type: Agent Tool
title: action_kubernetes_rollback_deployment
description: "Execute a rollback to the previous stable deployment version after SRE approval, for code regression remediation."
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

# action_kubernetes_rollback_deployment

Execute a rollback to the previous stable deployment version after SRE approval, for code regression remediation.

- **Kind:** action
- **Source system:** [Kubernetes](/systems/kubernetes.md)
- **API:** POST /systems/kubernetes/deployments/{name}/rollback

## Inputs

- deployment_name
- target_version

## Outputs

- rollback_id
- new_pod_status

## Side Effects

- May change Kubernetes state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_kubernetes_rollback_deployment](/policies/confirmation-action-kubernetes-rollback-deployment.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kubernetes](/systems/kubernetes.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alert_intake_correlation](/workflow/alert-intake-correlation.md)
- [context_aware_remediation_selection](/workflow/context-aware-remediation-selection.md)
- [execution_verification](/workflow/execution-verification.md)

## Evals

- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)

## Evidence emitted

- api_response

## Required inputs

- deployment_name
- target_version

## Produces

- rollback_id
- new_pod_status

# Examples

```
action_kubernetes_rollback_deployment(deployment_name=<deployment_name>, target_version=<target_version>)
```

# Citations

- [Kubernetes](/systems/kubernetes.md)
- [Confirmation policy — action_kubernetes_rollback_deployment](/policies/confirmation-action-kubernetes-rollback-deployment.md)
