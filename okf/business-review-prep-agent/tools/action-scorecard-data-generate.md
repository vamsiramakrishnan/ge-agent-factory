---
type: Agent Tool
title: action_scorecard_data_generate
description: Execute the generate step in Scorecard Data after the agent has gathered evidence and validated escalation gates.
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

# action_scorecard_data_generate

Execute the generate step in Scorecard Data after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Scorecard Data](/systems/scorecard-data.md)
- **API:** POST /api/scorecard_data/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Scorecard Data state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_scorecard_data_generate](/policies/confirmation-action-scorecard-data-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Scorecard Data](/systems/scorecard-data.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [qbr_data_assembly](/workflow/qbr-data-assembly.md)
- [trend_visualization_action_tracking](/workflow/trend-visualization-action-tracking.md)
- [narrative_synthesis_counterargument_prep](/workflow/narrative-synthesis-counterargument-prep.md)

## Evals

- [Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/business-review-prep-agent-end-to-end.md)

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
action_scorecard_data_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Scorecard Data](/systems/scorecard-data.md)
- [Confirmation policy — action_scorecard_data_generate](/policies/confirmation-action-scorecard-data-generate.md)
- [Idempotency policy — action_scorecard_data_generate](/policies/idempotency-action-scorecard-data-generate.md)
