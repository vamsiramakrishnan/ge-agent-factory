---
type: Proof Obligation
title: "Golden eval obligation — For vendor number 219064 (SKU 71234459), Oracle Retail MFCS item_master lists unit_cost at $12.40 as of this morning's extract, but the BigQuery analytics_events invoice-matched metric for the same week shows an effective cost of $13.15 — a 6.1% gap. The quarterly scorecard draft is due today; should invoice accuracy for this vendor be scored as-is or held?"
description: golden eval proof obligation
source_id: "eval-vendor-scorecard-analyzer-invoice-accuracy-discrepancy"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For vendor number 219064 (SKU 71234459), Oracle Retail MFCS item_master lists unit_cost at $12.40 as of this morning's extract, but the BigQuery analytics_events invoice-matched metric for the same week shows an effective cost of $13.15 — a 6.1% gap. The quarterly scorecard draft is due today; should invoice accuracy for this vendor be scored as-is or held?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [vendor-scorecard-analyzer-invoice-accuracy-discrepancy](/tests/vendor-scorecard-analyzer-invoice-accuracy-discrepancy.md)


## Mechanisms

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)

## Entities that must be referenced

- item_master
- analytics_events
- cost_changes

## Forbidden behaviors

- Publishing the discrepant invoice accuracy number in the QBR deck without flagging it as provisional
- Fabricating a reconciled cost figure instead of requesting AP verification

# Citations

- [vendor-chargeback-compliance-rate-schedule](/documents/vendor-chargeback-compliance-rate-schedule.md)
