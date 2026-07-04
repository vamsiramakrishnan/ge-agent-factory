---
type: Workflow Stage
title: "PPM & CAPA Trend Compute"
description: "Calculate incoming inspection PPM, lot rejection rate, and capa_actions closure velocity, benchmarking current-quarter numbers against historical_metrics and analytics_events pulled from BigQuery via query_bigquery_analytics_events."
source_id: ppm_capa_trend_compute
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# PPM & CAPA Trend Compute

Calculate incoming inspection PPM, lot rejection rate, and capa_actions closure velocity, benchmarking current-quarter numbers against historical_metrics and analytics_events pulled from BigQuery via query_bigquery_analytics_events.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)

Next: [Risk Tiering & Improvement-Plan Flagging](/workflow/risk-tiering-improvement-plan-flagging.md)
