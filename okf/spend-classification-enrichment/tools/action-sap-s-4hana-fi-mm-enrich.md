---
type: Agent Tool
title: action_sap_s_4hana_fi_mm_enrich
description: Execute the enrich step in SAP S/4HANA FI/MM after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_fi_mm_enrich

Execute the enrich step in SAP S/4HANA FI/MM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA FI/MM](/systems/sap-s-4hana-fi-mm.md)
- **API:** POST /api/sap_s_4hana_fi_mm/enrich

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA FI/MM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_fi_mm_enrich](/policies/confirmation-action-sap-s-4hana-fi-mm-enrich.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI/MM](/systems/sap-s-4hana-fi-mm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_extraction](/workflow/data-extraction.md)
- [spend_cube_load](/workflow/spend-cube-load.md)

## Evals

- [Run the Spend Classification & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-classification-enrichment-end-to-end.md)

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
action_sap_s_4hana_fi_mm_enrich(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA FI/MM](/systems/sap-s-4hana-fi-mm.md)
- [Confirmation policy — action_sap_s_4hana_fi_mm_enrich](/policies/confirmation-action-sap-s-4hana-fi-mm-enrich.md)
- [Idempotency policy — action_sap_s_4hana_fi_mm_enrich](/policies/idempotency-action-sap-s-4hana-fi-mm-enrich.md)
