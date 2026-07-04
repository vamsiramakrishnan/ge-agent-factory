---
type: Agent Tool
title: action_sap_ariba_e_auction_generate
description: "Execute the generate step in SAP Ariba e-Auction after the agent has gathered evidence and validated escalation gates."
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

# action_sap_ariba_e_auction_generate

Execute the generate step in SAP Ariba e-Auction after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [SAP Ariba e-Auction](/systems/sap-ariba-e-auction.md)
- **API:** POST /api/sap_ariba_e_auction/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change SAP Ariba e-Auction state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_sap_ariba_e_auction_generate](/policies/confirmation-action-sap-ariba-e-auction-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP Ariba e-Auction](/systems/sap-ariba-e-auction.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [historical_data_assembly](/workflow/historical-data-assembly.md)
- [game_theory_optimization](/workflow/game-theory-optimization.md)
- [strategy_brief_generation](/workflow/strategy-brief-generation.md)

## Evals

- [Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/auction-strategy-advisor-end-to-end.md)

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
action_sap_ariba_e_auction_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [SAP Ariba e-Auction](/systems/sap-ariba-e-auction.md)
- [Confirmation policy — action_sap_ariba_e_auction_generate](/policies/confirmation-action-sap-ariba-e-auction-generate.md)
- [Idempotency policy — action_sap_ariba_e_auction_generate](/policies/idempotency-action-sap-ariba-e-auction-generate.md)
