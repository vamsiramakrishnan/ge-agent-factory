---
type: Agent Tool
title: action_onetrust_sync
description: Execute the sync step in OneTrust after the agent has gathered evidence and validated escalation gates.
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

# action_onetrust_sync

Execute the sync step in OneTrust after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [OneTrust](/systems/onetrust.md)
- **API:** POST /api/onetrust/sync

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change OneTrust state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_onetrust_sync](/policies/confirmation-action-onetrust-sync.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [OneTrust](/systems/onetrust.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [consent_inventory](/workflow/consent-inventory.md)
- [compliance_scoring](/workflow/compliance-scoring.md)
- [reporting_remediation](/workflow/reporting-remediation.md)

## Evals

- [Run the Marketing Compliance & Consent Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-compliance-consent-manager-end-to-end.md)

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
action_onetrust_sync(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [OneTrust](/systems/onetrust.md)
- [Confirmation policy — action_onetrust_sync](/policies/confirmation-action-onetrust-sync.md)
- [Idempotency policy — action_onetrust_sync](/policies/idempotency-action-onetrust-sync.md)
