---
type: Workflow Stage
title: "Disposition, credit issuance & audit"
description: "Execute action_amdocs_ces_billing_send to post the credit or denial to Amdocs CES Billing with a full audit trail, or escalate to the Billing Operations Manager when delegation or evidence gates are not met."
source_id: disposition_credit_issuance_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Disposition, credit issuance & audit

Execute action_amdocs_ces_billing_send to post the credit or denial to Amdocs CES Billing with a full audit trail, or escalate to the Billing Operations Manager when delegation or evidence gates are not met.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)
