---
type: Agent Tool
title: action_apigee_deploy
description: Execute the deploy step in Apigee after the agent has gathered evidence and validated escalation gates.
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

# action_apigee_deploy

Execute the deploy step in Apigee after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Apigee](/systems/apigee.md)
- **API:** POST /api/apigee/deploy

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Apigee state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_apigee_deploy](/policies/confirmation-action-apigee-deploy.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Apigee](/systems/apigee.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [api_discovery](/workflow/api-discovery.md)

## Evals

- [Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/api-catalog-governance-end-to-end.md)

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
action_apigee_deploy(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Apigee](/systems/apigee.md)
- [Confirmation policy — action_apigee_deploy](/policies/confirmation-action-apigee-deploy.md)
- [Idempotency policy — action_apigee_deploy](/policies/idempotency-action-apigee-deploy.md)
