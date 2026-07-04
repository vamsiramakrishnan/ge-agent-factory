---
type: Agent Tool
title: action_coupa_ariba_catalog_generate
description: Execute the generate step in Coupa/Ariba Catalog after the agent has gathered evidence and validated escalation gates.
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

# action_coupa_ariba_catalog_generate

Execute the generate step in Coupa/Ariba Catalog after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md)
- **API:** POST /api/coupa_ariba_catalog/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Coupa/Ariba Catalog state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_coupa_ariba_catalog_generate](/policies/confirmation-action-coupa-ariba-catalog-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [off_contract_detection](/workflow/off-contract-detection.md)
- [root_cause_classification](/workflow/root-cause-classification.md)
- [personalized_nudge_generation](/workflow/personalized-nudge-generation.md)

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

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
action_coupa_ariba_catalog_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md)
- [Confirmation policy — action_coupa_ariba_catalog_generate](/policies/confirmation-action-coupa-ariba-catalog-generate.md)
- [Idempotency policy — action_coupa_ariba_catalog_generate](/policies/idempotency-action-coupa-ariba-catalog-generate.md)
