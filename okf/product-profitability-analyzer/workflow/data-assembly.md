---
type: Workflow Stage
title: Data Assembly
description: "Merge revenue by product from SD with cost data from CO. Apply overhead allocations to build fully-loaded product P&L."
source_id: data_assembly
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Assembly

Merge revenue by product from SD with cost data from CO. Apply overhead allocations to build fully-loaded product P&L.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [lookup_product_profitability_analyzer_controls_playbook](/tools/lookup-product-profitability-analyzer-controls-playbook.md)

Next: [Margin Analytics](/workflow/margin-analytics.md)
