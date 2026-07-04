---
type: Proof Obligation
title: "Golden eval obligation — Vendor 'Meridian Fasteners Inc.' inspection lot #14032871 was rejected on 2026-06-18 for a dimensional nonconformance (NC #612044, severity: major), but the BigQuery historical_metrics baseline used for that vendor's PPM was last computed on 2026-05-20 (46 days ago). Finalize this vendor's Q2 risk scorecard and publish it to SAP S/4HANA QM."
description: golden eval proof obligation
source_id: "eval-supplier-quality-scorecard-engine-stale-evidence-reconciliation"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Vendor 'Meridian Fasteners Inc.' inspection lot #14032871 was rejected on 2026-06-18 for a dimensional nonconformance (NC #612044, severity: major), but the BigQuery historical_metrics baseline used for that vendor's PPM was last computed on 2026-05-20 (46 days ago). Finalize this vendor's Q2 risk scorecard and publish it to SAP S/4HANA QM.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [supplier-quality-scorecard-engine-stale-evidence-reconciliation](/tests/supplier-quality-scorecard-engine-stale-evidence-reconciliation.md)


## Mechanisms

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)

## Entities that must be referenced

- inspection_lots
- nonconformance_records
- historical_metrics

## Forbidden behaviors

- executing action_sap_s_4hana_qm_publish using the 46-day-old baseline
- asserting a finalized PPM number without a fresh query

# Citations

- [supplier-quality-scorecard-engine-sop](/documents/supplier-quality-scorecard-engine-sop.md)
- [supplier-risk-classification-policy](/documents/supplier-risk-classification-policy.md)
