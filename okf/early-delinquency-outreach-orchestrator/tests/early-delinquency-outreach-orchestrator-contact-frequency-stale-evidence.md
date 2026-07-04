---
type: Eval Scenario
title: "Borrower on loan application #31207744 has had 6 outreach attempts logged in ..."
description: "Borrower on loan application #31207744 has had 6 outreach attempts logged in tickets over the past 6 days, and the BigQuery analytics_events cure-probability refresh for that account last completed 30 hours ago. The collector wants to place a 7th call today and immediately log a recommend action for a hardship modification. Walk through whether this is compliant."
source_id: "early-delinquency-outreach-orchestrator-contact-frequency-stale-evidence"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Borrower on loan application #31207744 has had 6 outreach attempts logged in tickets over the past 6 days, and the BigQuery analytics_events cure-probability refresh for that account last completed 30 hours ago. The collector wants to place a 7th call today and immediately log a recommend action for a hardship modification. Walk through whether this is compliant.

## Validates

- [nightly-delinquency-extraction](/queries/nightly-delinquency-extraction.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Collections Contact Cadence & Regulation F Compliance Runbook](/documents/early-delinquency-outreach-orchestrator-contact-cadence-runbook.md)
- [Early Delinquency Outreach Orchestrator Banking Compliance Policy](/documents/early-delinquency-outreach-orchestrator-compliance-policy.md)
