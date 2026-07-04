---
type: Query Capability
title: "Pull financial stability data from D&B and RapidRatings, cyber risk from BitS..."
description: "Pull financial stability data from D&B and RapidRatings, cyber risk from BitSight, operational signals from Resilinc, and credit ratings from Moody's. Normalize into a common risk framework in BigQuery."
source_id: "risk-data-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull financial stability data from D&B and RapidRatings, cyber risk from BitSight, operational signals from Resilinc, and credit ratings from Moody's. Normalize into a common risk framework in BigQuery.

## Tools used

- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [lookup_supplier_risk_scoring_engine_policy_guide](/tools/lookup-supplier-risk-scoring-engine-policy-guide.md)

## Runs in

- [risk_data_aggregation](/workflow/risk-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Supplier Risk Scoring Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-risk-scoring-engine-end-to-end.md)

# Citations

- [Supplier Risk Scoring Engine Procurement Policy Guide](/documents/supplier-risk-scoring-engine-policy-guide.md)
