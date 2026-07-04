---
type: Workflow Stage
title: "New-Account Document Exception Detection"
description: "Query newly booked core_accounts records in Temenos Transact the same day they post open_date and flag any with an unacknowledged reg_dd_disclosure_acknowledged or missing signature card against the required-document checklist."
source_id: new_account_document_exception_detection
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# New-Account Document Exception Detection

Query newly booked core_accounts records in Temenos Transact the same day they post open_date and flag any with an unacknowledged reg_dd_disclosure_acknowledged or missing signature card against the required-document checklist.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [lookup_account_opening_doc_followup_agent_compliance_policy](/tools/lookup-account-opening-doc-followup-agent-compliance-policy.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)

Next: [DocuSign Envelope & Recipient Reconciliation](/workflow/docu-sign-envelope-recipient-reconciliation.md)
