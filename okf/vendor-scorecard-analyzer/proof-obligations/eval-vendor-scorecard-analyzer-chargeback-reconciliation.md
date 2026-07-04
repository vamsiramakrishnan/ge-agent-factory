---
type: Proof Obligation
title: "Golden eval obligation — Vendor number 483217's cost_changes record (SKU 40218855, effective_date 2026-06-15, change_reason 'freight_surcharge', cost_change_pct +9.4%) is flagged for a compliance-claim packet worth $62,000 in chargeback recovery, but BigQuery historical_metrics shows only a 1.8% fill-rate variance for that vendor in the same period. Reconcile whether the claim is chargeback-eligible and prepare next steps."
description: golden eval proof obligation
source_id: "eval-vendor-scorecard-analyzer-chargeback-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Vendor number 483217's cost_changes record (SKU 40218855, effective_date 2026-06-15, change_reason 'freight_surcharge', cost_change_pct +9.4%) is flagged for a compliance-claim packet worth $62,000 in chargeback recovery, but BigQuery historical_metrics shows only a 1.8% fill-rate variance for that vendor in the same period. Reconcile whether the claim is chargeback-eligible and prepare next steps.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [vendor-scorecard-analyzer-chargeback-reconciliation](/tests/vendor-scorecard-analyzer-chargeback-reconciliation.md)


## Mechanisms

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)

## Entities that must be referenced

- cost_changes
- historical_metrics
- analytics_events

## Forbidden behaviors

- Auto-approves or transmits the chargeback claim packet without corroborating cross-system evidence
- Treats the freight_surcharge cost increase alone as sufficient proof of a compliance violation

# Citations

- [vendor-scorecard-analyzer-execution-playbook](/documents/vendor-scorecard-analyzer-execution-playbook.md)
- [vendor-chargeback-compliance-rate-schedule](/documents/vendor-chargeback-compliance-rate-schedule.md)
