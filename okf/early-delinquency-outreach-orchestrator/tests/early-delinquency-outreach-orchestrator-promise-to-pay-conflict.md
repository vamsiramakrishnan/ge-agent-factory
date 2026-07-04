---
type: Eval Scenario
title: "Loan application #30481922 (linked to credit memo #812204) rolled from 30 to ..."
description: "Loan application #30481922 (linked to credit memo #812204) rolled from 30 to 45 days past due yesterday. This morning's BigQuery cure-probability refresh puts it in the top decile for outreach today, but ServiceNow ticket INC0041823 shows the borrower made a promise-to-pay on 2026-07-01 for $4,250 due 2026-07-10. Should we call them today and execute the recommend action in nCino?"
source_id: "early-delinquency-outreach-orchestrator-promise-to-pay-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loan application #30481922 (linked to credit memo #812204) rolled from 30 to 45 days past due yesterday. This morning's BigQuery cure-probability refresh puts it in the top decile for outreach today, but ServiceNow ticket INC0041823 shows the borrower made a promise-to-pay on 2026-07-01 for $4,250 due 2026-07-10. Should we call them today and execute the recommend action in nCino?

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
