---
type: Workflow Stage
title: "Risk-Based Attribution Decomposition"
description: "Decompose each desk's P&L move into market-factor, new-trade, and amendment buckets by pairing positions.unrealized_gain_loss against risk_measures (desk, measure_type, measure_value) from Murex MX.3."
source_id: risk_based_attribution_decomposition
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk-Based Attribution Decomposition

Decompose each desk's P&L move into market-factor, new-trade, and amendment buckets by pairing positions.unrealized_gain_loss against risk_measures (desk, measure_type, measure_value) from Murex MX.3.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

Next: [Break Pattern Matching Against Historical Library](/workflow/break-pattern-matching-against-historical-library.md)
