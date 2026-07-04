---
type: Eval Scenario
title: Core account 40218273 (product_type savings) was booked 14 days ago with reg_...
description: "Core account 40218273 (product_type savings) was booked 14 days ago with reg_dd_disclosure_acknowledged still false. Its DocuSign envelope shows status 'sent' as of yesterday, but the audit_trails record has no completed action from the customer. Branch staff say they saw an email reply and want the exception closed today. Determine whether the document packet is actually cured and what should happen next."
source_id: "account-opening-doc-followup-agent-stale-envelope-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Core account 40218273 (product_type savings) was booked 14 days ago with reg_dd_disclosure_acknowledged still false. Its DocuSign envelope shows status 'sent' as of yesterday, but the audit_trails record has no completed action from the customer. Branch staff say they saw an email reply and want the exception closed today. Determine whether the document packet is actually cured and what should happen next.

## Validates

- [new-account-document-exception-detection](/queries/new-account-document-exception-detection.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Account Opening Document Follow-Up Agent Banking Compliance Policy](/documents/account-opening-doc-followup-agent-compliance-policy.md)
- [Account Opening Required Document Checklist & Cure Cadence Runbook](/documents/account-opening-required-document-checklist-runbook.md)
