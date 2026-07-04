---
type: Eval Scenario
title: Run the Deposit Attrition Early Warning Monitor workflow for the current peri...
description: "Run the Deposit Attrition Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "deposit-attrition-early-warning-monitor-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Deposit Attrition Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

## Success rubric

Action publish executed against Temenos Transact, with audit-trail entry and Retail Deposits Product Manager notified of outcomes.

# Citations

- [Deposit Attrition Early Warning Monitor Banking Compliance Policy](/documents/deposit-attrition-early-warning-monitor-compliance-policy.md)
