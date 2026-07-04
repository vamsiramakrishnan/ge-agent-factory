---
type: Agent Tool
title: action_oracle_retail_mfcs_route
description: Execute the route step in Oracle Retail MFCS after the agent has gathered evidence and validated escalation gates.
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

# action_oracle_retail_mfcs_route

Execute the route step in Oracle Retail MFCS after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
- **API:** POST /api/oracle_retail_mfcs/route

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Oracle Retail MFCS state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_oracle_retail_mfcs_route](/policies/confirmation-action-oracle-retail-mfcs-route.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [vendor_item_reconciliation](/workflow/vendor-item-reconciliation.md)
- [compliance_chargeback_evidence_assembly](/workflow/compliance-chargeback-evidence-assembly.md)
- [manager_routing_audit](/workflow/manager-routing-audit.md)

## Evals

- [Run the Vendor Performance Scorecard Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-scorecard-analyzer-end-to-end.md)

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
action_oracle_retail_mfcs_route(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
- [Confirmation policy — action_oracle_retail_mfcs_route](/policies/confirmation-action-oracle-retail-mfcs-route.md)
- [Idempotency policy — action_oracle_retail_mfcs_route](/policies/idempotency-action-oracle-retail-mfcs-route.md)
