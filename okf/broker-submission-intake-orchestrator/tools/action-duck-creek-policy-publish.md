---
type: Agent Tool
title: action_duck_creek_policy_publish
description: Execute the publish step in Duck Creek Policy after the agent has gathered evidence and validated escalation gates.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_duck_creek_policy_publish

Execute the publish step in Duck Creek Policy after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Duck Creek Policy](/systems/duck-creek-policy.md)
- **API:** POST /api/duck_creek_policy/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Duck Creek Policy state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_duck_creek_policy_publish](/policies/confirmation-action-duck-creek-policy-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Duck Creek Policy](/systems/duck-creek-policy.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [submission_ingestion_structuring](/workflow/submission-ingestion-structuring.md)
- [completeness_consistency_triage](/workflow/completeness-consistency-triage.md)
- [authority_referral_sanctions_gating](/workflow/authority-referral-sanctions-gating.md)
- [publish_intake_analytics](/workflow/publish-intake-analytics.md)

## Evals

- [Run the Broker Submission Intake Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/broker-submission-intake-orchestrator-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_duck_creek_policy_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Duck Creek Policy](/systems/duck-creek-policy.md)
- [Confirmation policy — action_duck_creek_policy_publish](/policies/confirmation-action-duck-creek-policy-publish.md)
- [Idempotency policy — action_duck_creek_policy_publish](/policies/idempotency-action-duck-creek-policy-publish.md)
