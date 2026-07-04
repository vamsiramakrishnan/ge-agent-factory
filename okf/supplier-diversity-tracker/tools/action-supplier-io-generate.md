---
type: Agent Tool
title: action_supplier_io_generate
description: Execute the generate step in Supplier.io after the agent has gathered evidence and validated escalation gates.
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

# action_supplier_io_generate

Execute the generate step in Supplier.io after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Supplier.io](/systems/supplier-io.md)
- **API:** POST /api/supplier_io/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Supplier.io state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_supplier_io_generate](/policies/confirmation-action-supplier-io-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Supplier.io](/systems/supplier-io.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [spend_attribution_goal_tracking](/workflow/spend-attribution-goal-tracking.md)
- [narrative_report_generation](/workflow/narrative-report-generation.md)

## Evals

- [Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-diversity-tracker-end-to-end.md)

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
action_supplier_io_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Supplier.io](/systems/supplier-io.md)
- [Confirmation policy — action_supplier_io_generate](/policies/confirmation-action-supplier-io-generate.md)
- [Idempotency policy — action_supplier_io_generate](/policies/idempotency-action-supplier-io-generate.md)
