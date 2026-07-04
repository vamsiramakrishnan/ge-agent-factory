---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the send step in Guidewire BillingCenter with a full audit trail, and escalate exceptions to the Billing Operations Analyst."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the send step in Guidewire BillingCenter with a full audit trail, and escalate exceptions to the Billing Operations Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)
- [action_guidewire_billingcenter_send](/tools/action-guidewire-billingcenter-send.md)
