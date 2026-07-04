---
type: Eval Scenario
title: Run the Counterparty Credit Exposure Monitor workflow for the current period....
description: "Run the Counterparty Credit Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "counterparty-credit-exposure-monitor-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Counterparty Credit Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [exposure-collateral-aggregation](/queries/exposure-collateral-aggregation.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)

## Success rubric

Action file executed against Murex MX.3, with audit-trail entry and Counterparty Risk Manager notified of outcomes.

# Citations

- [Counterparty Credit Exposure Monitor Banking Compliance Policy](/documents/counterparty-credit-exposure-monitor-compliance-policy.md)
