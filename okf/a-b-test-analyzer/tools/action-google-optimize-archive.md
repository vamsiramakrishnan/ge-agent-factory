---
type: Agent Tool
title: action_google_optimize_archive
description: Execute the archive step in Google Optimize after the agent has gathered evidence and validated escalation gates.
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

# action_google_optimize_archive

Execute the archive step in Google Optimize after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Google Optimize](/systems/google-optimize.md)
- **API:** POST /api/google_optimize/archive

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

- [Confirmation policy — action_google_optimize_archive](/policies/confirmation-action-google-optimize-archive.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Optimize](/systems/google-optimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [test_data_collection](/workflow/test-data-collection.md)
- [archive_learning](/workflow/archive-learning.md)

## Evals

- [Run the A/B Test Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/a-b-test-analyzer-end-to-end.md)

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
action_google_optimize_archive(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Google Optimize](/systems/google-optimize.md)
- [Confirmation policy — action_google_optimize_archive](/policies/confirmation-action-google-optimize-archive.md)
- [Idempotency policy — action_google_optimize_archive](/policies/idempotency-action-google-optimize-archive.md)
