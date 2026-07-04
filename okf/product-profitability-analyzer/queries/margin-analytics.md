---
type: Query Capability
title: "Calculate contribution margins at multiple levels (gross, operating, net). De..."
description: "Calculate contribution margins at multiple levels (gross, operating, net). Decompose margin changes into price, volume, mix, and cost components. Identify trending products."
source_id: "margin-analytics"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Calculate contribution margins at multiple levels (gross, operating, net). Decompose margin changes into price, volume, mix, and cost components. Identify trending products.

## Tools used

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_product_profitability_analyzer_controls_playbook](/tools/lookup-product-profitability-analyzer-controls-playbook.md)

## Runs in

- [margin_analytics](/workflow/margin-analytics.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/product-profitability-analyzer-end-to-end.md)

# Citations

- [Product Profitability Analyzer Controls Playbook](/documents/product-profitability-analyzer-controls-playbook.md)
