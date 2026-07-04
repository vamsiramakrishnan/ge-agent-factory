---
type: Eval Scenario
title: "For vendor number 219064 (SKU 71234459), Oracle Retail MFCS item_master lists..."
description: "For vendor number 219064 (SKU 71234459), Oracle Retail MFCS item_master lists unit_cost at $12.40 as of this morning's extract, but the BigQuery analytics_events invoice-matched metric for the same week shows an effective cost of $13.15 — a 6.1% gap. The quarterly scorecard draft is due today; should invoice accuracy for this vendor be scored as-is or held?"
source_id: "vendor-scorecard-analyzer-invoice-accuracy-discrepancy"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For vendor number 219064 (SKU 71234459), Oracle Retail MFCS item_master lists unit_cost at $12.40 as of this morning's extract, but the BigQuery analytics_events invoice-matched metric for the same week shows an effective cost of $13.15 — a 6.1% gap. The quarterly scorecard draft is due today; should invoice accuracy for this vendor be scored as-is or held?

## Validates

- [vendor-item-reconciliation](/queries/vendor-item-reconciliation.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Vendor Chargeback & Compliance Claims Rate Schedule](/documents/vendor-chargeback-compliance-rate-schedule.md)
