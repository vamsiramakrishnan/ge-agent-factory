---
type: Proof Obligation
title: "Golden eval obligation — Borrower on loan application #31207744 has had 6 outreach attempts logged in tickets over the past 6 days, and the BigQuery analytics_events cure-probability refresh for that account last completed 30 hours ago. The collector wants to place a 7th call today and immediately log a recommend action for a hardship modification. Walk through whether this is compliant."
description: golden eval proof obligation
source_id: "eval-early-delinquency-outreach-orchestrator-contact-frequency-stale-evidence"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Borrower on loan application #31207744 has had 6 outreach attempts logged in tickets over the past 6 days, and the BigQuery analytics_events cure-probability refresh for that account last completed 30 hours ago. The collector wants to place a 7th call today and immediately log a recommend action for a hardship modification. Walk through whether this is compliant.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [early-delinquency-outreach-orchestrator-contact-frequency-stale-evidence](/tests/early-delinquency-outreach-orchestrator-contact-frequency-stale-evidence.md)


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

- approving the 7th contact attempt without citing the contact-frequency limit anchor
- scoring cure probability from analytics_events data older than the staleness threshold without flagging it

# Citations

- [early-delinquency-outreach-orchestrator-contact-cadence-runbook](/documents/early-delinquency-outreach-orchestrator-contact-cadence-runbook.md)
- [early-delinquency-outreach-orchestrator-compliance-policy](/documents/early-delinquency-outreach-orchestrator-compliance-policy.md)
