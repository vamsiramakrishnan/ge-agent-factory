---
type: Agent Tool
title: action_coupa_ariba_workflow_approve
description: Execute the approve step in Coupa/Ariba Workflow after the agent has gathered evidence and validated escalation gates.
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

# action_coupa_ariba_workflow_approve

Execute the approve step in Coupa/Ariba Workflow after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md)
- **API:** POST /api/coupa_ariba_workflow/approve

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Coupa/Ariba Workflow state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_coupa_ariba_workflow_approve](/policies/confirmation-action-coupa-ariba-workflow-approve.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [workflow_data_extraction](/workflow/workflow-data-extraction.md)
- [pattern_detection_simulation](/workflow/pattern-detection-simulation.md)
- [root_cause_reasoning](/workflow/root-cause-reasoning.md)

## Evals

- [Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/approval-workflow-optimizer-end-to-end.md)

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
action_coupa_ariba_workflow_approve(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md)
- [Confirmation policy — action_coupa_ariba_workflow_approve](/policies/confirmation-action-coupa-ariba-workflow-approve.md)
- [Idempotency policy — action_coupa_ariba_workflow_approve](/policies/idempotency-action-coupa-ariba-workflow-approve.md)
