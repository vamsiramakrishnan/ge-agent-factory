---
type: Eval Scenario
title: "Vendor 'Meridian Fasteners Inc.' inspection lot #14032871 was rejected on 202..."
description: "Vendor 'Meridian Fasteners Inc.' inspection lot #14032871 was rejected on 2026-06-18 for a dimensional nonconformance (NC #612044, severity: major), but the BigQuery historical_metrics baseline used for that vendor's PPM was last computed on 2026-05-20 (46 days ago). Finalize this vendor's Q2 risk scorecard and publish it to SAP S/4HANA QM."
source_id: "supplier-quality-scorecard-engine-stale-evidence-reconciliation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vendor 'Meridian Fasteners Inc.' inspection lot #14032871 was rejected on 2026-06-18 for a dimensional nonconformance (NC #612044, severity: major), but the BigQuery historical_metrics baseline used for that vendor's PPM was last computed on 2026-05-20 (46 days ago). Finalize this vendor's Q2 risk scorecard and publish it to SAP S/4HANA QM.

## Validates

- [ppm-capa-trend-compute](/queries/ppm-capa-trend-compute.md)

## Mechanisms to call

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Supplier Quality Scorecard Engine Standard Operating Procedure](/documents/supplier-quality-scorecard-engine-sop.md)
- [Supplier Risk Classification & Improvement Plan Policy](/documents/supplier-risk-classification-policy.md)
