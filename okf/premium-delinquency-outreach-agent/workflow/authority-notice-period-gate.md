---
type: Workflow Stage
title: "Authority & Notice-Period Gate"
description: "Cite the Premium Delinquency Outreach Agent Authority & Referral Guide and the Nonpayment Cancellation Notice & Dunning Cadence Compliance Playbook to confirm the state-mandated notice period, autopay-failure grace handling, and escalation thresholds before any message or notice is finalized for a billing_accounts record."
source_id: authority_notice_period_gate
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Authority & Notice-Period Gate

Cite the Premium Delinquency Outreach Agent Authority & Referral Guide and the Nonpayment Cancellation Notice & Dunning Cadence Compliance Playbook to confirm the state-mandated notice period, autopay-failure grace handling, and escalation thresholds before any message or notice is finalized for a billing_accounts record.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)

Next: [Reminder Dispatch, Escalation & Audit](/workflow/reminder-dispatch-escalation-audit.md)
