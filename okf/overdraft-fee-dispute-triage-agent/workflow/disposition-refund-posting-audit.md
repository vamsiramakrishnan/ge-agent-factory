---
type: Workflow Stage
title: "Disposition, Refund Posting & Audit"
description: "Execute action_temenos_transact_escalate to post the refund or escalate the pattern-abuse case in Temenos Transact, update the ServiceNow tickets status, and emit the generated_audit_trail evidence for the Retail Banking Service Manager."
source_id: disposition_refund_posting_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Disposition, Refund Posting & Audit

Execute action_temenos_transact_escalate to post the refund or escalate the pattern-abuse case in Temenos Transact, update the ServiceNow tickets status, and emit the generated_audit_trail evidence for the Retail Banking Service Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_temenos_transact_escalate](/tools/action-temenos-transact-escalate.md)
