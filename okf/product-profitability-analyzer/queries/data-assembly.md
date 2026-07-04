---
type: Query Capability
title: Merge revenue by product from SD with cost data from CO. Apply overhead alloc...
description: "Merge revenue by product from SD with cost data from CO. Apply overhead allocations to build fully-loaded product P&L."
source_id: "data-assembly"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Merge revenue by product from SD with cost data from CO. Apply overhead allocations to build fully-loaded product P&L.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_product_profitability_analyzer_controls_playbook](/tools/lookup-product-profitability-analyzer-controls-playbook.md)

## Runs in

- [data_assembly](/workflow/data-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/product-profitability-analyzer-end-to-end.md)

# Citations

- [Product Profitability Analyzer Controls Playbook](/documents/product-profitability-analyzer-controls-playbook.md)
