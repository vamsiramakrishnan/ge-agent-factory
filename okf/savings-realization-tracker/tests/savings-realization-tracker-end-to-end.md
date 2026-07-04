---
type: Eval Scenario
title: Run the Savings Realization Tracker workflow for the current period. Cite the...
description: "Run the Savings Realization Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "savings-realization-tracker-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Savings Realization Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [leakage-interpretation-reporting](/queries/leakage-interpretation-reporting.md)

## Mechanisms to call

- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_sap_ariba_suppliers](/tools/query-sap-ariba-suppliers.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_savings_realization_tracker_policy_guide](/tools/lookup-savings-realization-tracker-policy-guide.md)
- [action_coupa_generate](/tools/action-coupa-generate.md)

## Success rubric

Action generate executed against Coupa, with audit-trail entry and CPO notified of outcomes.

# Citations

- [Savings Realization Tracker Procurement Policy Guide](/documents/savings-realization-tracker-policy-guide.md)
