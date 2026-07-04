---
type: Workflow Stage
title: Margin Call Dispute Reconciliation
description: "Reconcile open margin-call valuation breaks using Looker explore_queries and dashboards against Murex MX.3 positions, and draft a dispute summary with both sides' valuations for the collateral team."
source_id: margin_call_dispute_reconciliation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Margin Call Dispute Reconciliation

Reconcile open margin-call valuation breaks using Looker explore_queries and dashboards against Murex MX.3 positions, and draft a dispute summary with both sides' valuations for the collateral team.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)

Next: [Limit & Threshold Validation](/workflow/limit-threshold-validation.md)
