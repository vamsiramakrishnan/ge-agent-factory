---
type: Eval Scenario
title: Run the Fraud Rule Tuning Analyzer workflow for the current period. Cite the ...
description: "Run the Fraud Rule Tuning Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fraud-rule-tuning-analyzer-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Fraud Rule Tuning Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [alert-to-outcome-reconciliation](/queries/alert-to-outcome-reconciliation.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_fraud_rule_tuning_analyzer_compliance_policy](/tools/lookup-fraud-rule-tuning-analyzer-compliance-policy.md)
- [action_nice_actimize_recommend](/tools/action-nice-actimize-recommend.md)

## Success rubric

Action recommend executed against NICE Actimize, with audit-trail entry and Fraud Strategy Manager notified of outcomes.

# Citations

- [Fraud Rule Tuning Analyzer Banking Compliance Policy](/documents/fraud-rule-tuning-analyzer-compliance-policy.md)
