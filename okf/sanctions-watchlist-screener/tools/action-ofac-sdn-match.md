---
type: Agent Tool
title: action_ofac_sdn_match
description: Execute the match step in OFAC/SDN after the agent has gathered evidence and validated escalation gates.
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

# action_ofac_sdn_match

Execute the match step in OFAC/SDN after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [OFAC/SDN](/systems/ofac-sdn.md)
- **API:** POST /api/ofac_sdn/match

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change OFAC/SDN state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ofac_sdn_match](/policies/confirmation-action-ofac-sdn-match.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [OFAC/SDN](/systems/ofac-sdn.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [batch_event_screening](/workflow/batch-event-screening.md)
- [fuzzy_entity_matching](/workflow/fuzzy-entity-matching.md)
- [ambiguity_resolution](/workflow/ambiguity-resolution.md)

## Evals

- [Run the Sanctions & Watchlist Screener workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sanctions-watchlist-screener-end-to-end.md)

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
action_ofac_sdn_match(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [OFAC/SDN](/systems/ofac-sdn.md)
- [Confirmation policy — action_ofac_sdn_match](/policies/confirmation-action-ofac-sdn-match.md)
- [Idempotency policy — action_ofac_sdn_match](/policies/idempotency-action-ofac-sdn-match.md)
