---
type: Query Capability
title: "Gemini generates scorecard commentary explaining the numbers: 'OTIF dropped f..."
description: "Gemini generates scorecard commentary explaining the numbers: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not a systemic delivery issue.' Contextualizes performance against peers."
source_id: "narrative-commentary-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates scorecard commentary explaining the numbers: 'OTIF dropped from 96% to 89% — driven by a single large order requiring 3 partial shipments due to raw material shortage, not a systemic delivery issue.' Contextualizes performance against peers.

## Tools used

- [lookup_supplier_scorecard_generator_policy_guide](/tools/lookup-supplier-scorecard-generator-policy-guide.md)
- [action_sap_s_4hana_qm_mm_generate](/tools/action-sap-s-4hana-qm-mm-generate.md)

## Runs in

- [narrative_commentary_generation](/workflow/narrative-commentary-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-scorecard-generator-end-to-end.md)

# Citations

- [Supplier Scorecard Generator Procurement Policy Guide](/documents/supplier-scorecard-generator-policy-guide.md)
