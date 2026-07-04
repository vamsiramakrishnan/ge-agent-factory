---
type: Agent Tool
title: action_amdocs_ces_billing_create
description: Execute the create step in Amdocs CES Billing after the agent has gathered evidence and validated escalation gates.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_amdocs_ces_billing_create

Execute the create step in Amdocs CES Billing after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
- **API:** POST /api/amdocs_ces_billing/create

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Amdocs CES Billing state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_amdocs_ces_billing_create](/policies/confirmation-action-amdocs-ces-billing-create.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Amdocs CES Billing](/systems/amdocs-ces-billing.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Revenue Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/revenue-leakage-detection-analyzer-end-to-end.md)

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
action_amdocs_ces_billing_create(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Amdocs CES Billing](/systems/amdocs-ces-billing.md)
- [Confirmation policy — action_amdocs_ces_billing_create](/policies/confirmation-action-amdocs-ces-billing-create.md)
- [Idempotency policy — action_amdocs_ces_billing_create](/policies/idempotency-action-amdocs-ces-billing-create.md)
