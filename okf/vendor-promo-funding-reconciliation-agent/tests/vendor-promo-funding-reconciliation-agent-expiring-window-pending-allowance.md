---
type: Eval Scenario
title: "Vendor 502931's off-invoice deal on SKU 84213067 (item_master unit_cost $2.10..."
description: "Vendor 502931's off-invoice deal on SKU 84213067 (item_master unit_cost $2.10, general_merchandise) has a cost_changes record dropping unit cost from $2.10 to $1.85 (change_reason 'allowance_expiration') effective 2026-06-25, but approval_status is still 'pending'. The BigQuery analytics_events read for this SKU shows $42,300 collected against a $61,000 committed deal, and per the deal terms the claim-filing window closes in 6 days. Submit the claim for the remaining $18,700 today."
source_id: "vendor-promo-funding-reconciliation-agent-expiring-window-pending-allowance"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vendor 502931's off-invoice deal on SKU 84213067 (item_master unit_cost $2.10, general_merchandise) has a cost_changes record dropping unit cost from $2.10 to $1.85 (change_reason 'allowance_expiration') effective 2026-06-25, but approval_status is still 'pending'. The BigQuery analytics_events read for this SKU shows $42,300 collected against a $61,000 committed deal, and per the deal terms the claim-filing window closes in 6 days. Submit the claim for the remaining $18,700 today.

## Validates

- [deal-cost-intake](/queries/deal-cost-intake.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_cost_changes](/tools/query-oracle-retail-mfcs-cost-changes.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Vendor Promo Funding Reconciliation Agent Retail Execution Playbook](/documents/vendor-promo-funding-reconciliation-agent-execution-playbook.md)
- [Vendor Deal Terms & Claim Substantiation Manual](/documents/vendor-deal-terms-claim-substantiation-manual.md)
