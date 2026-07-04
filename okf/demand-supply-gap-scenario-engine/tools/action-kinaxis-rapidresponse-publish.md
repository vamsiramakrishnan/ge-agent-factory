---
type: Agent Tool
title: action_kinaxis_rapidresponse_publish
description: Execute the publish step in Kinaxis RapidResponse after the agent has gathered evidence and validated escalation gates.
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

# action_kinaxis_rapidresponse_publish

Execute the publish step in Kinaxis RapidResponse after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
- **API:** POST /api/kinaxis_rapidresponse/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Kinaxis RapidResponse state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_kinaxis_rapidresponse_publish](/policies/confirmation-action-kinaxis-rapidresponse-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Demand-Supply Gap Scenario Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-supply-gap-scenario-engine-end-to-end.md)

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
action_kinaxis_rapidresponse_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
- [Confirmation policy — action_kinaxis_rapidresponse_publish](/policies/confirmation-action-kinaxis-rapidresponse-publish.md)
- [Idempotency policy — action_kinaxis_rapidresponse_publish](/policies/idempotency-action-kinaxis-rapidresponse-publish.md)
