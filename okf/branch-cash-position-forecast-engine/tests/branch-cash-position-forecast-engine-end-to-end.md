---
type: Eval Scenario
title: Run the Branch Cash Position Forecast Engine workflow for the current period....
description: "Run the Branch Cash Position Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "branch-cash-position-forecast-engine-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Branch Cash Position Forecast Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [branch-transaction-payroll-calendar-pull](/queries/branch-transaction-payroll-calendar-pull.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

## Success rubric

Action publish executed against Temenos Transact, with audit-trail entry and Branch Operations Manager notified of outcomes.

# Citations

- [Branch Cash Position Forecast Engine Banking Compliance Policy](/documents/branch-cash-position-forecast-engine-compliance-policy.md)
