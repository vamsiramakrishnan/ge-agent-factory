---
type: Eval Scenario
title: Run the Pay Equity Audit workflow for the current period. Cite the relevant s...
description: "Run the Pay Equity Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "pay-equity-audit-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Pay Equity Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [compensation-data-sync](/queries/compensation-data-sync.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_syndio_syndio_records](/tools/query-syndio-syndio-records.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_pay_equity_audit_policy_handbook](/tools/lookup-pay-equity-audit-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and CHRO notified of outcomes.

# Citations

- [Pay Equity Audit Policy Handbook](/documents/pay-equity-audit-policy-handbook.md)
