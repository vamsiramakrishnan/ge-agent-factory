---
type: Workflow Stage
title: Risk Data Aggregation
description: "Pull financial stability data from D&B and RapidRatings, cyber risk from BitSight, operational signals from Resilinc, and credit ratings from Moody's. Normalize into a common risk framework in BigQuery."
source_id: risk_data_aggregation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Risk Data Aggregation

Pull financial stability data from D&B and RapidRatings, cyber risk from BitSight, operational signals from Resilinc, and credit ratings from Moody's. Normalize into a common risk framework in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [lookup_supplier_risk_scoring_engine_policy_guide](/tools/lookup-supplier-risk-scoring-engine-policy-guide.md)

Next: [Multi-Factor Risk Scoring](/workflow/multi-factor-risk-scoring.md)
