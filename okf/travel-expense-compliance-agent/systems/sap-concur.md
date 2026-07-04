---
type: Source System
title: SAP Concur
description: "Expense reports, receipts, trip data, policy rule configuration"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP Concur

Expense reports, receipts, trip data, policy rule configuration

- **Protocol:** RFC/BAPI
- **Local backing:** alloydb

# Schema

- [expense_reports](/tables/expense-reports.md)
- [travel_bookings](/tables/travel-bookings.md)
- [policy_exceptions](/tables/policy-exceptions.md)

## Tools using this system

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)
- [action_sap_concur_submit](/tools/action-sap-concur-submit.md)
