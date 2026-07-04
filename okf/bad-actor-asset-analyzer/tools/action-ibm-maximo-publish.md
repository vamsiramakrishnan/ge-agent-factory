---
type: Agent Tool
title: action_ibm_maximo_publish
description: Execute the publish step in IBM Maximo after the agent has gathered evidence and validated escalation gates.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_ibm_maximo_publish

Execute the publish step in IBM Maximo after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [IBM Maximo](/systems/ibm-maximo.md)
- **API:** POST /api/ibm_maximo/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change IBM Maximo state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ibm_maximo_publish](/policies/confirmation-action-ibm-maximo-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [IBM Maximo](/systems/ibm-maximo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bad-actor-asset-analyzer-end-to-end.md)

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
action_ibm_maximo_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [IBM Maximo](/systems/ibm-maximo.md)
- [Confirmation policy — action_ibm_maximo_publish](/policies/confirmation-action-ibm-maximo-publish.md)
- [Idempotency policy — action_ibm_maximo_publish](/policies/idempotency-action-ibm-maximo-publish.md)
