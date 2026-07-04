---
type: Agent Tool
title: action_vendor_master_generate
description: Execute the generate step in Vendor Master after the agent has gathered evidence and validated escalation gates.
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

# action_vendor_master_generate

Execute the generate step in Vendor Master after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Vendor Master](/systems/vendor-master.md)
- **API:** POST /api/vendor_master/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Vendor Master state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_vendor_master_generate](/policies/confirmation-action-vendor-master-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Vendor Master](/systems/vendor-master.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [supplier_overlap_mapping](/workflow/supplier-overlap-mapping.md)
- [feasibility_reasoning_business_case](/workflow/feasibility-reasoning-business-case.md)

## Evals

- [Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-consolidation-analyzer-end-to-end.md)

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
action_vendor_master_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Vendor Master](/systems/vendor-master.md)
- [Confirmation policy — action_vendor_master_generate](/policies/confirmation-action-vendor-master-generate.md)
- [Idempotency policy — action_vendor_master_generate](/policies/idempotency-action-vendor-master-generate.md)
