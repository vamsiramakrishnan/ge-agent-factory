---
type: Workflow Stage
title: Retrieve Records
description: Query trades and positions from Murex MX.3 for the Counterparty Credit Exposure Monitor workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query trades and positions from Murex MX.3 for the Counterparty Credit Exposure Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
