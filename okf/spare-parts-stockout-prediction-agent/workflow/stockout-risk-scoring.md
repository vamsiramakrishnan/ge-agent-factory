---
type: Workflow Stage
title: Stockout Risk Scoring
description: "Compare current coverage exposure against historical_metrics and analytics_events baselines in BigQuery (query_bigquery_analytics_events) to score stockout probability per part and rank the MRO Storeroom Manager's queue by asset criticality_ranking."
source_id: stockout_risk_scoring
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Stockout Risk Scoring

Compare current coverage exposure against historical_metrics and analytics_events baselines in BigQuery (query_bigquery_analytics_events) to score stockout probability per part and rank the MRO Storeroom Manager's queue by asset criticality_ranking.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)

Next: [Reorder Policy & Requisition Drafting](/workflow/reorder-policy-requisition-drafting.md)
