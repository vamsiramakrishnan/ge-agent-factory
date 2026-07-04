---
type: Eval Scenario
title: Run the Contract Analytics Dashboard workflow for the current period. Cite th...
description: "Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "contract-analytics-dashboard-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [metadata-extraction](/queries/metadata-extraction.md)

## Mechanisms to call

- [query_icertis_analytics_contracts](/tools/query-icertis-analytics-contracts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_contract_analytics_dashboard_policy_guide](/tools/lookup-contract-analytics-dashboard-policy-guide.md)
- [action_icertis_analytics_generate](/tools/action-icertis-analytics-generate.md)

## Success rubric

Action generate executed against Icertis Analytics, with audit-trail entry and Contract Manager notified of outcomes.

# Citations

- [Contract Analytics Dashboard Procurement Policy Guide](/documents/contract-analytics-dashboard-policy-guide.md)
