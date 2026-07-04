---
type: Agent Tool
title: action_metricstream_execute
description: Execute the execute step in MetricStream after the agent has gathered evidence and validated escalation gates.
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

# action_metricstream_execute

Execute the execute step in MetricStream after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [MetricStream](/systems/metricstream.md)
- **API:** POST /api/metricstream/execute

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change MetricStream state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_metricstream_execute](/policies/confirmation-action-metricstream-execute.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [MetricStream](/systems/metricstream.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [regulatory_change_detection](/workflow/regulatory-change-detection.md)

## Evals

- [Run the Regulatory Compliance Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-compliance-tracker-end-to-end.md)

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
action_metricstream_execute(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [MetricStream](/systems/metricstream.md)
- [Confirmation policy — action_metricstream_execute](/policies/confirmation-action-metricstream-execute.md)
- [Idempotency policy — action_metricstream_execute](/policies/idempotency-action-metricstream-execute.md)
