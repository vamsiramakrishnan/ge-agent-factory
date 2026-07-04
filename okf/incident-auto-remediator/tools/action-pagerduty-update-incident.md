---
type: Agent Tool
title: action_pagerduty_update_incident
description: "Update incident status, add incident notes with remediation action and verification results, and mark as resolved."
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

# action_pagerduty_update_incident

Update incident status, add incident notes with remediation action and verification results, and mark as resolved.

- **Kind:** action
- **Source system:** [PagerDuty](/systems/pagerduty.md)
- **API:** PATCH /systems/pagerduty/incidents/{id}

## Inputs

- incident_id
- status
- note

## Outputs

- updated_incident_id

## Side Effects

- May change PagerDuty state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_pagerduty_update_incident](/policies/confirmation-action-pagerduty-update-incident.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [PagerDuty](/systems/pagerduty.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alert_intake_correlation](/workflow/alert-intake-correlation.md)
- [root_cause_ranking](/workflow/root-cause-ranking.md)
- [execution_verification](/workflow/execution-verification.md)

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)

## Evidence emitted

- api_response

## Required inputs

- incident_id
- status
- note

## Produces

- updated_incident_id

# Examples

```
action_pagerduty_update_incident(incident_id=<incident_id>, status=<status>, note=<note>)
```

# Citations

- [PagerDuty](/systems/pagerduty.md)
- [Confirmation policy — action_pagerduty_update_incident](/policies/confirmation-action-pagerduty-update-incident.md)
