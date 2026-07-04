---
type: Workflow Stage
title: "Proof-of-Mailing Reconciliation & Filing"
description: "Reconcile DocuSign audit_trails against the dispatched envelope for certified-mail or tracked-delivery confirmation, then file the completed cancellation action in Guidewire BillingCenter via action_guidewire_billingcenter_file with the audit trail attached to the billing_accounts record."
source_id: proof_of_mailing_reconciliation_filing
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Proof-of-Mailing Reconciliation & Filing

Reconcile DocuSign audit_trails against the dispatched envelope for certified-mail or tracked-delivery confirmation, then file the completed cancellation action in Guidewire BillingCenter via action_guidewire_billingcenter_file with the audit trail attached to the billing_accounts record.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

Next: [Exception Escalation & Compliance Reporting](/workflow/exception-escalation-compliance-reporting.md)
