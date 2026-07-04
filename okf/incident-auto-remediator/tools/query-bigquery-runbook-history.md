---
type: Agent Tool
title: query_bigquery_runbook_history
description: Query historical incident patterns and runbook success rates to rank probable root causes and match symptoms.
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

# query_bigquery_runbook_history

Query historical incident patterns and runbook success rates to rank probable root causes and match symptoms.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- symptom_pattern

## Outputs

- matched_runbooks
- success_rates

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [root_cause_ranking](/workflow/root-cause-ranking.md)
- [context_aware_remediation_selection](/workflow/context-aware-remediation-selection.md)

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)
- [PagerDuty alert INC-0044: Database connection pool exhaustion, Sev-1. No matching runbook. Request SRE Manager assessment.](/tests/sev1-escalation-no-auto-action.md)

## Evidence emitted

- sql_result

## Required inputs

- symptom_pattern

## Produces

- matched_runbooks
- success_rates

# Examples

```
query_bigquery_runbook_history(symptom_pattern=<symptom_pattern>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
