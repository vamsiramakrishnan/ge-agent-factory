---
type: Agent Tool
title: action_sap_s_4hana_recommend
description: Execute the recommend step in SAP S/4HANA after the agent has gathered evidence and validated escalation gates.
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

# action_sap_s_4hana_recommend

Execute the recommend step in SAP S/4HANA after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP S/4HANA](/systems/sap-s-4hana.md)
- **API:** POST /api/sap_s_4hana/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP S/4HANA state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_s_4hana_recommend](/policies/confirmation-action-sap-s-4hana-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s-4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_data_gathering](/workflow/cost-data-gathering.md)
- [strategic_synthesis_recommendation](/workflow/strategic-synthesis-recommendation.md)

## Evals

- [Run the Make-vs-Buy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/make-vs-buy-analyzer-end-to-end.md)

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
action_sap_s_4hana_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s-4hana.md)
- [Confirmation policy — action_sap_s_4hana_recommend](/policies/confirmation-action-sap-s-4hana-recommend.md)
- [Idempotency policy — action_sap_s_4hana_recommend](/policies/idempotency-action-sap-s-4hana-recommend.md)
