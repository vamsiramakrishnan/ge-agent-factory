---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and premium invoices from Guidewire BillingCenter and correlate with DocuSign for the Cancellation Notice Compliance Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and premium invoices from Guidewire BillingCenter and correlate with DocuSign for the Cancellation Notice Compliance Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
