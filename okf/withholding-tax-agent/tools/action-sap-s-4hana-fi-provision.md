---
type: Agent Tool
title: action_sap_s_4hana_fi_provision
description: Execute the provision step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_sap_s_4hana_fi_provision

Execute the provision step in SAP S/4HANA FI after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
- **API:** POST /api/sap_s_4hana_fi/provision

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA FI state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_fi_provision](/policies/confirmation-action-sap-s-4hana-fi-provision.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [treaty_provision_interpretation](/workflow/treaty-provision-interpretation.md)

## Evals

- [Run the Withholding Tax Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/withholding-tax-agent-end-to-end.md)

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
action_sap_s_4hana_fi_provision(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
- [Confirmation policy — action_sap_s_4hana_fi_provision](/policies/confirmation-action-sap-s-4hana-fi-provision.md)
- [Idempotency policy — action_sap_s_4hana_fi_provision](/policies/idempotency-action-sap-s-4hana-fi-provision.md)
