---
type: Query Capability
title: "Gemini handles the 15-20% of transactions ML classifiers cannot confidently c..."
description: "Gemini handles the 15-20% of transactions ML classifiers cannot confidently classify — PO descriptions like 'per quote #4521' or 'project materials — see attachment.' Reads vendor context, cost center, and purchase history to reason about correct category. Resolves entity ambiguities requiring business judgment."
source_id: "llm-enrichment"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini handles the 15-20% of transactions ML classifiers cannot confidently classify — PO descriptions like 'per quote #4521' or 'project materials — see attachment.' Reads vendor context, cost center, and purchase history to reason about correct category. Resolves entity ambiguities requiring business judgment.

## Tools used

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_spend_cube_builder_enrichment_policy_guide](/tools/lookup-spend-cube-builder-enrichment-policy-guide.md)
- [action_sap_s_4hana_enrich](/tools/action-sap-s-4hana-enrich.md)

## Runs in

- [llm_enrichment](/workflow/llm-enrichment.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Spend Cube Builder & Enrichment workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/spend-cube-builder-enrichment-end-to-end.md)

# Citations

- [Spend Cube Builder & Enrichment Procurement Policy Guide](/documents/spend-cube-builder-enrichment-policy-guide.md)
