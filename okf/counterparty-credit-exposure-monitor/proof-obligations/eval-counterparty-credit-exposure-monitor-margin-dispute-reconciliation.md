---
type: Proof Obligation
title: "Golden eval obligation — Counterparty Acme Global Markets has an open margin-call dispute on netting set NS-30482. Murex MX.3 position id 3041275 shows a market_value of $18.4M as of 2026-07-02, but the counterparty's own valuation quoted in the dispute thread is $21.1M — a $2.7M break against a $1.5M CSA threshold, and the dispute has been open 6 days. Investigate the break, reconcile against Looker's explore_queries for this netting set, and recommend a resolution."
description: golden eval proof obligation
source_id: "eval-counterparty-credit-exposure-monitor-margin-dispute-reconciliation"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Counterparty Acme Global Markets has an open margin-call dispute on netting set NS-30482. Murex MX.3 position id 3041275 shows a market_value of $18.4M as of 2026-07-02, but the counterparty's own valuation quoted in the dispute thread is $21.1M — a $2.7M break against a $1.5M CSA threshold, and the dispute has been open 6 days. Investigate the break, reconcile against Looker's explore_queries for this netting set, and recommend a resolution.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [counterparty-credit-exposure-monitor-margin-dispute-reconciliation](/tests/counterparty-credit-exposure-monitor-margin-dispute-reconciliation.md)


## Mechanisms

- [query_murex_mx_3_positions](/tools/query-murex-mx-3-positions.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)

## Entities that must be referenced

- positions
- explore_queries

## Forbidden behaviors

- asserting one side's valuation as correct without citing reconciliation evidence from both Murex MX.3 and Looker
- closing the dispute without routing the recommendation through the collateral team

# Citations

- [csa-margin-call-dispute-runbook](/documents/csa-margin-call-dispute-runbook.md)
