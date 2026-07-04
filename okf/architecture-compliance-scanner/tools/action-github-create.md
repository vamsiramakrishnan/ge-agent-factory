---
type: Agent Tool
title: action_github_create
description: Execute the create step in GitHub after the agent has gathered evidence and validated escalation gates.
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

# action_github_create

Execute the create step in GitHub after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [GitHub](/systems/github.md)
- **API:** POST /api/github/create

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change GitHub state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_github_create](/policies/confirmation-action-github-create.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [GitHub](/systems/github.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_source_scanning](/workflow/multi-source-scanning.md)
- [contextual_remediation](/workflow/contextual-remediation.md)
- [tracking_reporting](/workflow/tracking-reporting.md)

## Evals

- [Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/architecture-compliance-scanner-end-to-end.md)

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
action_github_create(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [GitHub](/systems/github.md)
- [Confirmation policy — action_github_create](/policies/confirmation-action-github-create.md)
- [Idempotency policy — action_github_create](/policies/idempotency-action-github-create.md)
