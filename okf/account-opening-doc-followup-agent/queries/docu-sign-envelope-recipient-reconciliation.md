---
type: Query Capability
title: "Query envelopes, recipients, and audit_trails in DocuSign to determine whethe..."
description: "Query envelopes, recipients, and audit_trails in DocuSign to determine whether the missing agreement was ever routed, is still pending signature, or has expired or terminated without execution."
source_id: "docu-sign-envelope-recipient-reconciliation"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query envelopes, recipients, and audit_trails in DocuSign to determine whether the missing agreement was ever routed, is still pending signature, or has expired or terminated without execution.

## Tools used

- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)

## Runs in

- [docu_sign_envelope_recipient_reconciliation](/workflow/docu-sign-envelope-recipient-reconciliation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Account Opening Document Follow-Up Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/account-opening-doc-followup-agent-end-to-end.md)
- [Core account 40218273 (product_type savings) was booked 14 days ago with reg_dd_disclosure_acknowledged still false. Its DocuSign envelope shows status 'sent' as of yesterday, but the audit_trails record has no completed action from the customer. Branch staff say they saw an email reply and want the exception closed today. Determine whether the document packet is actually cured and what should happen next.](/tests/account-opening-doc-followup-agent-stale-envelope-conflict.md)
- [Two savings accounts opened the same week need a decision today: account 55901234 (open_date 12 days ago, signature card still unsigned in DocuSign) and account 55901240 (open_date 9 days ago, its envelope shows status terminated with no identity-verification document on file in core_accounts). Reconcile which exception must escalate now versus stay on the reminder cadence, and recommend the next action for each.](/tests/account-opening-doc-followup-agent-aging-threshold-reconciliation.md)

# Citations

- [Account Opening Document Follow-Up Agent Banking Compliance Policy](/documents/account-opening-doc-followup-agent-compliance-policy.md)
- [Account Opening Required Document Checklist & Cure Cadence Runbook](/documents/account-opening-required-document-checklist-runbook.md)
