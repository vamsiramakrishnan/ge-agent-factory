---
type: Eval Scenario
title: "Counterparty Acme Global Markets has an open margin-call dispute on netting s..."
description: "Counterparty Acme Global Markets has an open margin-call dispute on netting set NS-30482. Murex MX.3 position id 3041275 shows a market_value of $18.4M as of 2026-07-02, but the counterparty's own valuation quoted in the dispute thread is $21.1M — a $2.7M break against a $1.5M CSA threshold, and the dispute has been open 6 days. Investigate the break, reconcile against Looker's explore_queries for this netting set, and recommend a resolution."
source_id: "counterparty-credit-exposure-monitor-margin-dispute-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Counterparty Acme Global Markets has an open margin-call dispute on netting set NS-30482. Murex MX.3 position id 3041275 shows a market_value of $18.4M as of 2026-07-02, but the counterparty's own valuation quoted in the dispute thread is $21.1M — a $2.7M break against a $1.5M CSA threshold, and the dispute has been open 6 days. Investigate the break, reconcile against Looker's explore_queries for this netting set, and recommend a resolution.

## Validates

- [exposure-collateral-aggregation](/queries/exposure-collateral-aggregation.md)

## Mechanisms to call

- [query_murex_mx_3_positions](/tools/query-murex-mx-3-positions.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [CSA Margin Call Dispute Resolution Runbook](/documents/csa-margin-call-dispute-runbook.md)
