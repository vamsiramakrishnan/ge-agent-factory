---
type: Agent Tool
title: action_google_optimize_match
description: Execute the match step in Google Optimize after the agent has gathered evidence and validated escalation gates.
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

# action_google_optimize_match

Execute the match step in Google Optimize after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Optimize](/systems/google-optimize.md)
- **API:** POST /api/google_optimize/match

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Google Optimize state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_google_optimize_match](/policies/confirmation-action-google-optimize-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Optimize](/systems/google-optimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [visitor_context_assembly](/workflow/visitor-context-assembly.md)
- [variant_serving_tracking](/workflow/variant-serving-tracking.md)

## Evals

- [Run the Website Personalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/website-personalization-engine-end-to-end.md)

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
action_google_optimize_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Optimize](/systems/google-optimize.md)
- [Confirmation policy — action_google_optimize_match](/policies/confirmation-action-google-optimize-match.md)
- [Idempotency policy — action_google_optimize_match](/policies/idempotency-action-google-optimize-match.md)
