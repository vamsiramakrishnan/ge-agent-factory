---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest driver-add, mortgagee-update, and address-change requests arriving as email, portal, and call-summary tickets in Zendesk, and correlate each ticket to the named insured's record in Guidewire PolicyCenter.](/queries/change-request-intake-ticket-triage.md)
- [Match the requested change to the correct endorsement transaction against policies, policy_quotes, and underwriting_submissions in Guidewire PolicyCenter, confirming line_of_business and jurisdiction_state before proceeding.](/queries/endorsement-transaction-coverage-mapping.md)
- [Cross-check premium delta, exposure-class change, mortgagee/loss-payee status, and reinstatement lapse timing against the Endorsement Processing Agent Authority & Referral Guide and the Endorsement Forms, Rating & SLA Manual.](/queries/authority-referral-gating.md)
- [For routine, non-underwriting-impacting endorsements, execute action_guidewire_policycenter_route to quote the premium change against annual_premium and issue updated policy documents in Guidewire PolicyCenter.](/queries/straight-through-rating-document-issuance.md)
- [Log the generated_audit_trail for every routed transaction and reconcile Endorsement turnaround time and touchless-processing rate against analytics_events and historical_metrics in BigQuery for the Policy Services Rep queue.](/queries/audit-trail-turnaround-reconciliation.md)
