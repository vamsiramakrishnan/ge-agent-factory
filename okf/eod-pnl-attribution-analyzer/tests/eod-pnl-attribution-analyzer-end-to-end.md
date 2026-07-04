---
type: Eval Scenario
title: "Run the End-of-Day P&L Attribution Analyzer workflow for the current period. ..."
description: "Run the End-of-Day P&L Attribution Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "eod-pnl-attribution-analyzer-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the End-of-Day P&L Attribution Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

## Success rubric

Action publish executed against Murex MX.3, with audit-trail entry and Product Control Analyst notified of outcomes.

# Citations

- [End-of-Day P&L Attribution Analyzer Banking Compliance Policy](/documents/eod-pnl-attribution-analyzer-compliance-policy.md)
