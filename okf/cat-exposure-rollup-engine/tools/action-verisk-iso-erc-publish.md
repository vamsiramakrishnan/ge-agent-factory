---
type: Agent Tool
title: action_verisk_iso_erc_publish
description: Execute the publish step in Verisk ISO ERC after the agent has gathered evidence and validated escalation gates.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_verisk_iso_erc_publish

Execute the publish step in Verisk ISO ERC after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Verisk ISO ERC](/systems/verisk-iso-erc.md)
- **API:** POST /api/verisk_iso_erc/publish

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Verisk ISO ERC state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_verisk_iso_erc_publish](/policies/confirmation-action-verisk-iso-erc-publish.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Verisk ISO ERC](/systems/verisk-iso-erc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [in_force_book_geocoding_hazard_enrichment](/workflow/in-force-book-geocoding-hazard-enrichment.md)
- [evidence_validation_authority_check](/workflow/evidence-validation-authority-check.md)
- [publish_reinsurer_schedule_distribution](/workflow/publish-reinsurer-schedule-distribution.md)

## Evals

- [Run the Catastrophe Exposure Rollup Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cat-exposure-rollup-engine-end-to-end.md)

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
action_verisk_iso_erc_publish(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Verisk ISO ERC](/systems/verisk-iso-erc.md)
- [Confirmation policy — action_verisk_iso_erc_publish](/policies/confirmation-action-verisk-iso-erc-publish.md)
- [Idempotency policy — action_verisk_iso_erc_publish](/policies/idempotency-action-verisk-iso-erc-publish.md)
