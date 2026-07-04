---
type: Agent Tool
title: action_sap_ariba_category_mgmt_generate
description: Execute the generate step in SAP Ariba Category Mgmt after the agent has gathered evidence and validated escalation gates.
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

# action_sap_ariba_category_mgmt_generate

Execute the generate step in SAP Ariba Category Mgmt after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP Ariba Category Mgmt](/systems/sap-ariba-category-mgmt.md)
- **API:** POST /api/sap_ariba_category_mgmt/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP Ariba Category Mgmt state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_ariba_category_mgmt_generate](/policies/confirmation-action-sap-ariba-category-mgmt-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Ariba Category Mgmt](/systems/sap-ariba-category-mgmt.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [spend_aggregation](/workflow/spend-aggregation.md)
- [strategy_narrative_generation](/workflow/strategy-narrative-generation.md)
- [delivery_review](/workflow/delivery-review.md)

## Evals

- [Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-strategy-generator-end-to-end.md)

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
action_sap_ariba_category_mgmt_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP Ariba Category Mgmt](/systems/sap-ariba-category-mgmt.md)
- [Confirmation policy — action_sap_ariba_category_mgmt_generate](/policies/confirmation-action-sap-ariba-category-mgmt-generate.md)
- [Idempotency policy — action_sap_ariba_category_mgmt_generate](/policies/idempotency-action-sap-ariba-category-mgmt-generate.md)
