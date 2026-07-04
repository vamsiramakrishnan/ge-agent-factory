---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the send step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Billing Operations Manager."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the send step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Billing Operations Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)
