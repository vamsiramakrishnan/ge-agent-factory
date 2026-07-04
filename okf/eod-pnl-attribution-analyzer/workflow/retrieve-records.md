---
type: Workflow Stage
title: Retrieve Records
description: "Query trades and positions from Murex MX.3 for the End-of-Day P&L Attribution Analyzer workflow."
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query trades and positions from Murex MX.3 for the End-of-Day P&L Attribution Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
