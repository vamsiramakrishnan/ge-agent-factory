---
type: Proof Obligation
title: "Golden eval obligation — Loan application #30481922 (linked to credit memo #812204) rolled from 30 to 45 days past due yesterday. This morning's BigQuery cure-probability refresh puts it in the top decile for outreach today, but ServiceNow ticket INC0041823 shows the borrower made a promise-to-pay on 2026-07-01 for $4,250 due 2026-07-10. Should we call them today and execute the recommend action in nCino?"
description: golden eval proof obligation
source_id: "eval-early-delinquency-outreach-orchestrator-promise-to-pay-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Loan application #30481922 (linked to credit memo #812204) rolled from 30 to 45 days past due yesterday. This morning's BigQuery cure-probability refresh puts it in the top decile for outreach today, but ServiceNow ticket INC0041823 shows the borrower made a promise-to-pay on 2026-07-01 for $4,250 due 2026-07-10. Should we call them today and execute the recommend action in nCino?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [early-delinquency-outreach-orchestrator-promise-to-pay-conflict](/tests/early-delinquency-outreach-orchestrator-promise-to-pay-conflict.md)


## Mechanisms

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)

## Entities that must be referenced

- loan_applications
- tickets
- analytics_events

## Forbidden behaviors

- placing loan_applications #30481922 in today's outreach worklist despite the active promise-to-pay
- executing action_ncino_loan_origination_recommend without first checking tickets for suppression flags

# Citations

- [early-delinquency-outreach-orchestrator-contact-cadence-runbook](/documents/early-delinquency-outreach-orchestrator-contact-cadence-runbook.md)
