---
type: Query Capability
title: "Map approved requisition to the correct contract considering best price, near..."
description: "Map approved requisition to the correct contract considering best price, nearest warehouse, and available capacity. For multiple eligible contracts, ML scoring selects the optimal match."
source_id: "requisition-to-contract-matching"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Map approved requisition to the correct contract considering best price, nearest warehouse, and available capacity. For multiple eligible contracts, ML scoring selects the optimal match.

## Tools used

- [action_sap_s_4hana_mm_me21n_match](/tools/action-sap-s-4hana-mm-me21n-match.md)

## Runs in

- [requisition_to_contract_matching](/workflow/requisition-to-contract-matching.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/purchase-order-auto-generation-end-to-end.md)

# Citations

- [Purchase Order Auto-Generation Procurement Policy Guide](/documents/purchase-order-auto-generation-policy-guide.md)
