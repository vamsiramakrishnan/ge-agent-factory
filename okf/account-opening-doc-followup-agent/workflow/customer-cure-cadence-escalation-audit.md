---
type: Workflow Stage
title: "Customer Cure Cadence, Escalation & Audit"
description: "Draft the next customer reminder in the cadence or execute action_temenos_transact_escalate in Temenos Transact for exceptions aged past ten days, logging a full audit trail and notifying the Branch Operations Manager."
source_id: customer_cure_cadence_escalation_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Customer Cure Cadence, Escalation & Audit

Draft the next customer reminder in the cadence or execute action_temenos_transact_escalate in Temenos Transact for exceptions aged past ten days, logging a full audit trail and notifying the Branch Operations Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)
