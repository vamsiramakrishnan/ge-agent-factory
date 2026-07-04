---
type: Eval Scenario
title: Run the Intraday Liquidity Forecasting Engine workflow for the current period...
description: "Run the Intraday Liquidity Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "intraday-liquidity-forecasting-engine-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Intraday Liquidity Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_intraday_liquidity_forecasting_engine_compliance_policy](/tools/lookup-intraday-liquidity-forecasting-engine-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

## Success rubric

Action publish executed against Murex MX.3, with audit-trail entry and Treasury Manager notified of outcomes.

# Citations

- [Intraday Liquidity Forecasting Engine Banking Compliance Policy](/documents/intraday-liquidity-forecasting-engine-compliance-policy.md)
