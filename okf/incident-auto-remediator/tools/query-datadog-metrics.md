---
type: Agent Tool
title: query_datadog_metrics
description: "Retrieve memory, CPU, disk I/O, and error rate metrics to distinguish memory leaks from code regressions."
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

# query_datadog_metrics

Retrieve memory, CPU, disk I/O, and error rate metrics to distinguish memory leaks from code regressions.

- **Kind:** query
- **Source system:** [Datadog](/systems/datadog.md)

## Inputs

- service_id
- time_range

## Outputs

- metric_snapshot

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Datadog](/systems/datadog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alert_intake_correlation](/workflow/alert-intake-correlation.md)
- [execution_verification](/workflow/execution-verification.md)

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)
- [PagerDuty alert INC-0044: Database connection pool exhaustion, Sev-1. No matching runbook. Request SRE Manager assessment.](/tests/sev1-escalation-no-auto-action.md)

## Evidence emitted

- source_system_record

## Required inputs

- service_id
- time_range

## Produces

- metric_snapshot

# Examples

```
query_datadog_metrics(service_id=<service_id>, time_range=<time_range>)
```

# Citations

- [Datadog](/systems/datadog.md)
