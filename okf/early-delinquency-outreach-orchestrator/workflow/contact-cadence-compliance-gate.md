---
type: Workflow Stage
title: "Contact Cadence & Compliance Gate"
description: "Cite the Early Delinquency Outreach Orchestrator Banking Compliance Policy and the Collections Contact Cadence & Regulation F Compliance Runbook, then suppress any loan_applications record with an active promise-to-pay, pending payment, or cease-and-desist flag logged in tickets."
source_id: contact_cadence_compliance_gate
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Contact Cadence & Compliance Gate

Cite the Early Delinquency Outreach Orchestrator Banking Compliance Policy and the Collections Contact Cadence & Regulation F Compliance Runbook, then suppress any loan_applications record with an active promise-to-pay, pending payment, or cease-and-desist flag logged in tickets.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

Next: [Hardship Pre-Qualification & Message Drafting](/workflow/hardship-pre-qualification-message-drafting.md)
