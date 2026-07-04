---
type: Agent Tool
title: action_oracle_xstore_pos_file
description: Execute the file step in Oracle Xstore POS after the agent has gathered evidence and validated escalation gates.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_oracle_xstore_pos_file

Execute the file step in Oracle Xstore POS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
- **API:** POST /api/oracle_xstore_pos/file

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Oracle Xstore POS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_oracle_xstore_pos_file](/policies/confirmation-action-oracle-xstore-pos-file.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Xstore POS](/systems/oracle-xstore-pos.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [nightly_register_exception_scoring](/workflow/nightly-register-exception-scoring.md)
- [shift_cashier_attribution](/workflow/shift-cashier-attribution.md)
- [case_file_assembly_risk_ranking](/workflow/case-file-assembly-risk-ranking.md)
- [playbook_cash_accountability_evidence_gate](/workflow/playbook-cash-accountability-evidence-gate.md)
- [case_filing_district_ap_handoff](/workflow/case-filing-district-ap-handoff.md)

## Evals

- [Run the Shrink Anomaly Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shrink-anomaly-analyzer-end-to-end.md)

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
action_oracle_xstore_pos_file(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
- [Confirmation policy — action_oracle_xstore_pos_file](/policies/confirmation-action-oracle-xstore-pos-file.md)
- [Idempotency policy — action_oracle_xstore_pos_file](/policies/idempotency-action-oracle-xstore-pos-file.md)
