---
type: Workflow Stage
title: "Flash-to-Final P&L Capture"
description: "Pull trades, positions, and risk_measures from Murex MX.3 (query_murex_mx_3_trades) for each desk and reconcile the overnight flash P&L run against the final Murex MX.3 end-of-day close before any attribution begins."
source_id: flash_to_final_p_l_capture
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Flash-to-Final P&L Capture

Pull trades, positions, and risk_measures from Murex MX.3 (query_murex_mx_3_trades) for each desk and reconcile the overnight flash P&L run against the final Murex MX.3 end-of-day close before any attribution begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

Next: [Risk-Based Attribution Decomposition](/workflow/risk-based-attribution-decomposition.md)
