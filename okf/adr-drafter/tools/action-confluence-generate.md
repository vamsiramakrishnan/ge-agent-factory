---
type: Agent Tool
title: action_confluence_generate
description: Execute the generate step in Confluence after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_confluence_generate

Execute the generate step in Confluence after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Confluence](/systems/confluence.md)
- **API:** POST /api/confluence/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Confluence state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_confluence_generate](/policies/confirmation-action-confluence-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Confluence](/systems/confluence.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [context_retrieval](/workflow/context-retrieval.md)
- [publication](/workflow/publication.md)

## Evals

- [Run the ADR Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/adr-drafter-end-to-end.md)

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
action_confluence_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Confluence](/systems/confluence.md)
- [Confirmation policy — action_confluence_generate](/policies/confirmation-action-confluence-generate.md)
- [Idempotency policy — action_confluence_generate](/policies/idempotency-action-confluence-generate.md)
