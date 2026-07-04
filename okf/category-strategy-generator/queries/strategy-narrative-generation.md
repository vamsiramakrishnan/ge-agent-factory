---
type: Query Capability
title: Gemini reasons about which savings levers are realistic given category maturi...
description: "Gemini reasons about which savings levers are realistic given category maturity — consolidation vs. spec change vs. demand management. Drafts strategy document with trade-offs, not just data."
source_id: "strategy-narrative-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reasons about which savings levers are realistic given category maturity — consolidation vs. spec change vs. demand management. Drafts strategy document with trade-offs, not just data.

## Tools used

- [query_sap_ariba_category_mgmt_suppliers](/tools/query-sap-ariba-category-mgmt-suppliers.md)
- [lookup_category_strategy_generator_policy_guide](/tools/lookup-category-strategy-generator-policy-guide.md)
- [action_sap_ariba_category_mgmt_generate](/tools/action-sap-ariba-category-mgmt-generate.md)

## Runs in

- [strategy_narrative_generation](/workflow/strategy-narrative-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Category Strategy Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/category-strategy-generator-end-to-end.md)

# Citations

- [Category Strategy Generator Procurement Policy Guide](/documents/category-strategy-generator-policy-guide.md)
