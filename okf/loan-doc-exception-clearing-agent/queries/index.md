---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Poll nCino Loan Origination's loan_applications, credit_memos, and covenant_records the moment a new documentation gap posts, classifying each exception by risk_rating, decision_status, and cure path (UCC filing, insurance certificate, signed amendment).](/queries/exception-intake-severity-triage.md)
- [Correlate open exceptions against DocuSign envelopes, recipients, and audit_trails to determine whether a cure item is still outstanding, in signature routing, or already executed but not yet reflected in nCino.](/queries/cure-evidence-correlation.md)
- [Compare current open-exception counts and age-in-days against BigQuery historical_metrics, analytics_events, and cached_aggregates to build the weekly aging waterfall against the 2,400-to-350 exception-count baseline.](/queries/aging-waterfall-baseline-comparison.md)
- [Cite the Loan Documentation Exception Clearing Agent Banking Compliance Policy and the Collateral Perfection & Lien Documentation Cure Runbook via lookup_loan_doc_exception_clearing_agent_compliance_policy before any borrower letter, cure task, or escalation is issued.](/queries/compliance-cure-runbook-gating.md)
- [Draft borrower/insurer request letters, route signature items through DocuSign, open ServiceNow tickets, change_requests, or incidents for internal cure steps, and execute action_ncino_loan_origination_escalate for classified credits with a full audit trail to the Loan Operations Manager.](/queries/cure-dispatch-ticketing-escalation.md)
