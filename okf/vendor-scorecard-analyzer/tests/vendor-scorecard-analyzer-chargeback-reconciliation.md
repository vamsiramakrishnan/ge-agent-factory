---
type: Eval Scenario
title: "Vendor number 483217's cost_changes record (SKU 40218855, effective_date 2026..."
description: "Vendor number 483217's cost_changes record (SKU 40218855, effective_date 2026-06-15, change_reason 'freight_surcharge', cost_change_pct +9.4%) is flagged for a compliance-claim packet worth $62,000 in chargeback recovery, but BigQuery historical_metrics shows only a 1.8% fill-rate variance for that vendor in the same period. Reconcile whether the claim is chargeback-eligible and prepare next steps."
source_id: "vendor-scorecard-analyzer-chargeback-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vendor number 483217's cost_changes record (SKU 40218855, effective_date 2026-06-15, change_reason 'freight_surcharge', cost_change_pct +9.4%) is flagged for a compliance-claim packet worth $62,000 in chargeback recovery, but BigQuery historical_metrics shows only a 1.8% fill-rate variance for that vendor in the same period. Reconcile whether the claim is chargeback-eligible and prepare next steps.

## Validates

- [vendor-item-reconciliation](/queries/vendor-item-reconciliation.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Vendor Performance Scorecard Analyzer Retail Execution Playbook](/documents/vendor-scorecard-analyzer-execution-playbook.md)
- [Vendor Chargeback & Compliance Claims Rate Schedule](/documents/vendor-chargeback-compliance-rate-schedule.md)
