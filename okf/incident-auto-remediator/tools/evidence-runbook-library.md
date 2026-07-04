---
type: Agent Tool
title: evidence_runbook_library
description: "Cite the SRE runbook library for remediation recommendations (citation anchors: symptom-mapping, success-rate, rollback-criteria)."
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

# evidence_runbook_library

Cite the SRE runbook library for remediation recommendations (citation anchors: symptom-mapping, success-rate, rollback-criteria).

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- runbook_id

## Outputs

- runbook_citation

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

- document_reference

## Required inputs

- runbook_id

## Produces

- runbook_citation

# Examples

```
evidence_runbook_library(runbook_id=<runbook_id>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
