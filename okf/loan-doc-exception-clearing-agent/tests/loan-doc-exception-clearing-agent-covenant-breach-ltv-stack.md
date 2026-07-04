---
type: Eval Scenario
title: "Covenant record 612840 on application_number 34198822, a cre_mortgage product..."
description: "Covenant record 612840 on application_number 34198822, a cre_mortgage product, shows compliance_status breached with most_recent_test_value below its threshold_value and a next_test_date 32 days in the past. The same application's ltv is 0.81 with no additional collateral or guaranty on file. Reconcile whether this credit's documentation exception should be cleared from this week's queue or escalated, and to whom."
source_id: "loan-doc-exception-clearing-agent-covenant-breach-ltv-stack"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Covenant record 612840 on application_number 34198822, a cre_mortgage product, shows compliance_status breached with most_recent_test_value below its threshold_value and a next_test_date 32 days in the past. The same application's ltv is 0.81 with no additional collateral or guaranty on file. Reconcile whether this credit's documentation exception should be cleared from this week's queue or escalated, and to whom.

## Validates

- [exception-intake-severity-triage](/queries/exception-intake-severity-triage.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loan Documentation Exception Clearing Agent Banking Compliance Policy](/documents/loan-doc-exception-clearing-agent-compliance-policy.md)
- [Collateral Perfection & Lien Documentation Cure Runbook](/documents/collateral-perfection-lien-documentation-cure-runbook.md)
