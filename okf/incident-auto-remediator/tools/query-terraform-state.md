---
type: Agent Tool
title: query_terraform_state
description: "Retrieve infrastructure state and recent changes (deployments, configuration, capacity changes) to contextualize root cause."
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

# query_terraform_state

Retrieve infrastructure state and recent changes (deployments, configuration, capacity changes) to contextualize root cause.

- **Kind:** query
- **Source system:** [Terraform](/systems/terraform.md)

## Inputs

- service_id

## Outputs

- deployment_version
- recent_changes

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Terraform](/systems/terraform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)

## Evidence emitted

- source_system_record

## Required inputs

- service_id

## Produces

- deployment_version
- recent_changes

# Examples

```
query_terraform_state(service_id=<service_id>)
```

# Citations

- [Terraform](/systems/terraform.md)
