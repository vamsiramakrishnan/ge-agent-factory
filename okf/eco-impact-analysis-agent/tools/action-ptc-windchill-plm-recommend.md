---
type: Agent Tool
title: action_ptc_windchill_plm_recommend
description: Execute the recommend step in PTC Windchill PLM after the agent has gathered evidence and validated escalation gates.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_ptc_windchill_plm_recommend

Execute the recommend step in PTC Windchill PLM after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [PTC Windchill PLM](/systems/ptc-windchill-plm.md)
- **API:** POST /api/ptc_windchill_plm/recommend

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change PTC Windchill PLM state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_ptc_windchill_plm_recommend](/policies/confirmation-action-ptc-windchill-plm-recommend.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [PTC Windchill PLM](/systems/ptc-windchill-plm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [validate_evidence](/workflow/validate-evidence.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/eco-impact-analysis-agent-end-to-end.md)

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
action_ptc_windchill_plm_recommend(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [PTC Windchill PLM](/systems/ptc-windchill-plm.md)
- [Confirmation policy — action_ptc_windchill_plm_recommend](/policies/confirmation-action-ptc-windchill-plm-recommend.md)
- [Idempotency policy — action_ptc_windchill_plm_recommend](/policies/idempotency-action-ptc-windchill-plm-recommend.md)
