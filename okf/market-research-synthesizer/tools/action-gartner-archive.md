---
type: Agent Tool
title: action_gartner_archive
description: Execute the archive step in Gartner after the agent has gathered evidence and validated escalation gates.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_gartner_archive

Execute the archive step in Gartner after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Gartner](/systems/gartner.md)
- **API:** POST /api/gartner/archive

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Gartner state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_gartner_archive](/policies/confirmation-action-gartner-archive.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Gartner](/systems/gartner.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [source_aggregation](/workflow/source-aggregation.md)
- [distribution](/workflow/distribution.md)

## Evals

- [Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-research-synthesizer-end-to-end.md)

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
action_gartner_archive(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Gartner](/systems/gartner.md)
- [Confirmation policy — action_gartner_archive](/policies/confirmation-action-gartner-archive.md)
- [Idempotency policy — action_gartner_archive](/policies/idempotency-action-gartner-archive.md)
