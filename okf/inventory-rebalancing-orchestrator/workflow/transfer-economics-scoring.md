---
type: Workflow Stage
title: Transfer Economics Scoring
description: "Quantify freight cost versus expedite/premium-purchase cost for each candidate transfer using vendors (query_sap_s_4hana_mm_vendors) rating and risk_score data and BigQuery cached_aggregates and analytics_events, ranking transfers by inventory-turns and cycle-time impact."
source_id: transfer_economics_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Transfer Economics Scoring

Quantify freight cost versus expedite/premium-purchase cost for each candidate transfer using vendors (query_sap_s_4hana_mm_vendors) rating and risk_score data and BigQuery cached_aggregates and analytics_events, ranking transfers by inventory-turns and cycle-time impact.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

Next: [SOP & Authorization Gate](/workflow/sop-authorization-gate.md)
