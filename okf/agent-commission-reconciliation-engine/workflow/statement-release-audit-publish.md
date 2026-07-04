---
type: Workflow Stage
title: "Statement Release & Audit Publish"
description: "Execute action_guidewire_billingcenter_publish to release the reconciled statement in Guidewire BillingCenter once two-system evidence is gathered, emit the audit trail, and escalate exceptions above threshold to the Commission Accountant or Premium accounting supervisor."
source_id: statement_release_audit_publish
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Statement Release & Audit Publish

Execute action_guidewire_billingcenter_publish to release the reconciled statement in Guidewire BillingCenter once two-system evidence is gathered, emit the audit trail, and escalate exceptions above threshold to the Commission Accountant or Premium accounting supervisor.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)
- [action_guidewire_billingcenter_publish](/tools/action-guidewire-billingcenter-publish.md)
