---
type: Agent Tool
title: action_sap_ariba_sourcing_generate
description: Execute the generate step in SAP Ariba Sourcing after the agent has gathered evidence and validated escalation gates.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sap_ariba_sourcing_generate

Execute the generate step in SAP Ariba Sourcing after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP Ariba Sourcing](/systems/sap-ariba-sourcing.md)
- **API:** POST /api/sap_ariba_sourcing/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP Ariba Sourcing state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_ariba_sourcing_generate](/policies/confirmation-action-sap-ariba-sourcing-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Ariba Sourcing](/systems/sap-ariba-sourcing.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requirements_ingestion](/workflow/requirements-ingestion.md)
- [rfp_drafting_q_a](/workflow/rfp-drafting-q-a.md)
- [event_orchestration_distribution](/workflow/event-orchestration-distribution.md)

## Evals

- [Run the RFx Builder & Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/rfx-builder-orchestrator-end-to-end.md)

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
action_sap_ariba_sourcing_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP Ariba Sourcing](/systems/sap-ariba-sourcing.md)
- [Confirmation policy — action_sap_ariba_sourcing_generate](/policies/confirmation-action-sap-ariba-sourcing-generate.md)
- [Idempotency policy — action_sap_ariba_sourcing_generate](/policies/idempotency-action-sap-ariba-sourcing-generate.md)
