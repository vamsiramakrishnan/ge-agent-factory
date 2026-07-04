---
type: Agent Tool
title: action_sprout_social_draft
description: Execute the draft step in Sprout Social after the agent has gathered evidence and validated escalation gates.
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

# action_sprout_social_draft

Execute the draft step in Sprout Social after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Sprout Social](/systems/sprout-social.md)
- **API:** POST /api/sprout_social/draft

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Sprout Social state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sprout_social_draft](/policies/confirmation-action-sprout-social-draft.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sprout Social](/systems/sprout-social.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ugc_detection_curation](/workflow/ugc-detection-curation.md)
- [outreach_archival](/workflow/outreach-archival.md)

## Evals

- [Run the UGC & Advocacy Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ugc-advocacy-manager-end-to-end.md)

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
action_sprout_social_draft(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Sprout Social](/systems/sprout-social.md)
- [Confirmation policy — action_sprout_social_draft](/policies/confirmation-action-sprout-social-draft.md)
- [Idempotency policy — action_sprout_social_draft](/policies/idempotency-action-sprout-social-draft.md)
