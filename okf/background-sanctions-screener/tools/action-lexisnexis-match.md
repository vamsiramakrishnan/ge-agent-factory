---
type: Agent Tool
title: action_lexisnexis_match
description: Execute the match step in LexisNexis after the agent has gathered evidence and validated escalation gates.
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

# action_lexisnexis_match

Execute the match step in LexisNexis after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [LexisNexis](/systems/lexisnexis.md)
- **API:** POST /api/lexisnexis/match

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change LexisNexis state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_lexisnexis_match](/policies/confirmation-action-lexisnexis-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis](/systems/lexisnexis.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sanctions_watchlist_screening](/workflow/sanctions-watchlist-screening.md)
- [entity_resolution_fuzzy_matching](/workflow/entity-resolution-fuzzy-matching.md)

## Evals

- [Run the Background & Sanctions Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/background-sanctions-screener-end-to-end.md)

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
action_lexisnexis_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [LexisNexis](/systems/lexisnexis.md)
- [Confirmation policy — action_lexisnexis_match](/policies/confirmation-action-lexisnexis-match.md)
- [Idempotency policy — action_lexisnexis_match](/policies/idempotency-action-lexisnexis-match.md)
