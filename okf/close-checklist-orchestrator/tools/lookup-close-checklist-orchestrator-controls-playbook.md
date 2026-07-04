---
type: Agent Tool
title: lookup_close_checklist_orchestrator_controls_playbook
description: "Look up sections of the Close Checklist Orchestrator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_close_checklist_orchestrator_controls_playbook

Look up sections of the Close Checklist Orchestrator Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [BlackLine](/systems/blackline.md)
- **API:** POST /api/blackline/escalate

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- May change BlackLine state because the spec classifies it as evidence_lookup.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — lookup_close_checklist_orchestrator_controls_playbook](/policies/confirmation-lookup-close-checklist-orchestrator-controls-playbook.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [BlackLine](/systems/blackline.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [task_assignment_dependency](/workflow/task-assignment-dependency.md)
- [bottleneck_prediction](/workflow/bottleneck-prediction.md)
- [status_interpretation](/workflow/status-interpretation.md)
- [escalation_reporting](/workflow/escalation-reporting.md)

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_close_checklist_orchestrator_controls_playbook(section_anchor=<section_anchor>)
```

# Citations

- [BlackLine](/systems/blackline.md)
- [Confirmation policy — lookup_close_checklist_orchestrator_controls_playbook](/policies/confirmation-lookup-close-checklist-orchestrator-controls-playbook.md)
- [Idempotency policy — lookup_close_checklist_orchestrator_controls_playbook](/policies/idempotency-lookup-close-checklist-orchestrator-controls-playbook.md)
