---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query loan_applications from nCino Loan Origination for accounts newly rolling into 1-59 days past due and correlate against open tickets in ServiceNow that flag active hardship requests, disputes, or cease-and-desist notations.](/queries/nightly-delinquency-extraction.md)
- [Score each loan_applications record's self-cure likelihood using analytics_events and historical_metrics in BigQuery, ranking accounts by delinquency stage, DSCR trend from credit_memos, and prior contact outcomes to build the collector priority order.](/queries/cure-probability-segmentation.md)
- [Cite the Early Delinquency Outreach Orchestrator Banking Compliance Policy and the Collections Contact Cadence & Regulation F Compliance Runbook, then suppress any loan_applications record with an active promise-to-pay, pending payment, or cease-and-desist flag logged in tickets.](/queries/contact-cadence-compliance-gate.md)
- [Pre-qualify hardship program options against covenant_records compliance_status and credit_memos guarantor_strength, then draft a compliant outreach message naming the recommended contact channel and time window for each surviving loan_applications record.](/queries/hardship-pre-qualification-message-drafting.md)
- [Execute action_ncino_loan_origination_recommend to push the prioritized outreach recommendation into nCino Loan Origination with a full audit trail, and escalate exceptions to the Collections Supervisor for review.](/queries/worklist-assignment-recommend.md)
