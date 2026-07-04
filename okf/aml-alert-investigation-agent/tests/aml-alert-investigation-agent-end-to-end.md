---
type: Eval Scenario
title: Run the AML Alert Investigation Agent workflow for the current period. Cite t...
description: "Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "aml-alert-investigation-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the AML Alert Investigation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [alert-intake-case-binding](/queries/alert-intake-case-binding.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

## Success rubric

Action file executed against NICE Actimize, with audit-trail entry and AML Investigator notified of outcomes.

# Citations

- [AML Alert Investigation Agent Banking Compliance Policy](/documents/aml-alert-investigation-agent-compliance-policy.md)
