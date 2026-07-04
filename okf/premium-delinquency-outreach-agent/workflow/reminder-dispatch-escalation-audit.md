---
type: Workflow Stage
title: "Reminder Dispatch, Escalation & Audit"
description: "Execute action_guidewire_billingcenter_send to dispatch the personalized reminder, payment link, or statutory cancellation notice with a full audit trail, and escalate low-cure-probability, high-premium billing_accounts records to the Billing Operations Analyst with a suggested payment arrangement."
source_id: reminder_dispatch_escalation_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Reminder Dispatch, Escalation & Audit

Execute action_guidewire_billingcenter_send to dispatch the personalized reminder, payment link, or statutory cancellation notice with a full audit trail, and escalate low-cure-probability, high-premium billing_accounts records to the Billing Operations Analyst with a suggested payment arrangement.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)
- [action_guidewire_billingcenter_send](/tools/action-guidewire-billingcenter-send.md)
