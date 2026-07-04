---
type: Eval Scenario
title: "Run the Payroll Reconciliation & Compliance Agent workflow for the current pe..."
description: "Run the Payroll Reconciliation & Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "payroll-reconciliation-compliance-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Payroll Reconciliation & Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [post-run-collection](/queries/post-run-collection.md)

## Mechanisms to call

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_tax_systems_tax_systems_records](/tools/query-tax-systems-tax-systems-records.md)
- [lookup_payroll_reconciliation_compliance_agent_policy_handbook](/tools/lookup-payroll-reconciliation-compliance-agent-policy-handbook.md)
- [action_adp_update](/tools/action-adp-update.md)

## Success rubric

Action update executed against ADP, with audit-trail entry and Payroll Manager notified of outcomes.

# Citations

- [Payroll Reconciliation & Compliance Agent Policy Handbook](/documents/payroll-reconciliation-compliance-agent-policy-handbook.md)
