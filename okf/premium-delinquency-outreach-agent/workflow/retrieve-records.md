---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and premium invoices from Guidewire BillingCenter and correlate with Salesforce Marketing Cloud for the Premium Delinquency Outreach Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and premium invoices from Guidewire BillingCenter and correlate with Salesforce Marketing Cloud for the Premium Delinquency Outreach Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)
- [action_guidewire_billingcenter_send](/tools/action-guidewire-billingcenter-send.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
