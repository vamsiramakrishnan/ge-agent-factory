---
type: Eval Scenario
title: Run the ACH Return Root Cause Analyzer workflow for the current period. Cite ...
description: "Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "ach-return-root-cause-analyzer-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [relationship-owner-notification-scorecard-publication](/queries/relationship-owner-notification-scorecard-publication.md)

## Mechanisms to call

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)

## Success rubric

Action publish executed against FIS Payments Hub, with audit-trail entry and ACH Operations Analyst notified of outcomes.

# Citations

- [ACH Return Root Cause Analyzer Banking Compliance Policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
