---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Guidewire BillingCenter with a full audit trail, and escalate exceptions to the Commission Accountant."
source_id: act_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Guidewire BillingCenter with a full audit trail, and escalate exceptions to the Commission Accountant.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)
- [action_guidewire_billingcenter_publish](/tools/action-guidewire-billingcenter-publish.md)
