---
type: Query Capability
title: "Gemini analyzes margin compression root causes: raw material cost increases, ..."
description: "Gemini analyzes margin compression root causes: raw material cost increases, pricing lag, product mix shifts. Generates actionable recommendations with competitor context."
source_id: "profitability-reasoning"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes margin compression root causes: raw material cost increases, pricing lag, product mix shifts. Generates actionable recommendations with competitor context.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_product_profitability_analyzer_controls_playbook](/tools/lookup-product-profitability-analyzer-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Runs in

- [profitability_reasoning](/workflow/profitability-reasoning.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/product-profitability-analyzer-end-to-end.md)

# Citations

- [Product Profitability Analyzer Controls Playbook](/documents/product-profitability-analyzer-controls-playbook.md)
