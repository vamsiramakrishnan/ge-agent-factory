---
type: Query Capability
title: Gemini reasons about which auction format fits the specific competitive situa...
description: "Gemini reasons about which auction format fits the specific competitive situation — considering qualified bidders, switching costs, relationship dynamics, and category commoditization. Generates pre-auction briefing anticipating supplier behavior."
source_id: "strategy-brief-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reasons about which auction format fits the specific competitive situation — considering qualified bidders, switching costs, relationship dynamics, and category commoditization. Generates pre-auction briefing anticipating supplier behavior.

## Tools used

- [query_sap_ariba_e_auction_suppliers](/tools/query-sap-ariba-e-auction-suppliers.md)
- [lookup_auction_strategy_advisor_policy_guide](/tools/lookup-auction-strategy-advisor-policy-guide.md)
- [action_sap_ariba_e_auction_generate](/tools/action-sap-ariba-e-auction-generate.md)

## Runs in

- [strategy_brief_generation](/workflow/strategy-brief-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Auction Strategy Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/auction-strategy-advisor-end-to-end.md)

# Citations

- [Auction Strategy Advisor Procurement Policy Guide](/documents/auction-strategy-advisor-policy-guide.md)
