---
type: Eval Scenario
title: Run the Product Profitability Analyzer workflow for the current period. Cite ...
description: "Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "product-profitability-analyzer-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Product Profitability Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [margin-analytics](/queries/margin-analytics.md)

## Mechanisms to call

- [query_sap_s_4hana_co_cost_centers](/tools/query-sap-s-4hana-co-cost-centers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_product_profitability_analyzer_controls_playbook](/tools/lookup-product-profitability-analyzer-controls-playbook.md)
- [action_sap_s_4hana_co_recommend](/tools/action-sap-s-4hana-co-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA CO, with audit-trail entry and Controller notified of outcomes.

# Citations

- [Product Profitability Analyzer Controls Playbook](/documents/product-profitability-analyzer-controls-playbook.md)
