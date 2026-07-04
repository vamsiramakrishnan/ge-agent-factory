---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query newly booked core_accounts records in Temenos Transact the same day they post open_date and flag any with an unacknowledged reg_dd_disclosure_acknowledged or missing signature card against the required-document checklist.](/queries/new-account-document-exception-detection.md)
- [Query envelopes, recipients, and audit_trails in DocuSign to determine whether the missing agreement was ever routed, is still pending signature, or has expired or terminated without execution.](/queries/docu-sign-envelope-recipient-reconciliation.md)
- [Compare open exceptions against historical_metrics and analytics_events baselines in BigQuery to score days-since-open_date and rank the Branch Operations Manager's daily aging queue against the ten-day cure threshold.](/queries/exception-aging-severity-scoring.md)
- [Cross-check each exception against the Account Opening Document Follow-Up Agent Banking Compliance Policy and the required-document checklist runbook, citing the specific sections before any reminder cadence or escalation is recommended.](/queries/compliance-checklist-evidence-validation.md)
- [Draft the next customer reminder in the cadence or execute action_temenos_transact_escalate in Temenos Transact for exceptions aged past ten days, logging a full audit trail and notifying the Branch Operations Manager.](/queries/customer-cure-cadence-escalation-audit.md)
