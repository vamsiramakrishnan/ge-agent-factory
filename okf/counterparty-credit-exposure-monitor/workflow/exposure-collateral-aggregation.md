---
type: Workflow Stage
title: "Exposure & Collateral Aggregation"
description: "Pull trades, positions, and risk_measures from Murex MX.3 and roll them up by counterparty and netting set into an intraday potential future exposure (PFE) and collateral-coverage view."
source_id: exposure_collateral_aggregation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exposure & Collateral Aggregation

Pull trades, positions, and risk_measures from Murex MX.3 and roll them up by counterparty and netting set into an intraday potential future exposure (PFE) and collateral-coverage view.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)

Next: [Market Signal & Wrong-Way Risk Screening](/workflow/market-signal-wrong-way-risk-screening.md)
