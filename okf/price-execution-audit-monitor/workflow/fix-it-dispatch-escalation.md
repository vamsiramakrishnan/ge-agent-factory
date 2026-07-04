---
type: Workflow Stage
title: "Fix-It Dispatch & Escalation"
description: "Execute action_oracle_xstore_pos_escalate to raise store-level fix-it tasks or systemic feed-failure escalations to the Pricing Operations Manager, attaching the full audit trail."
source_id: fix_it_dispatch_escalation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fix-It Dispatch & Escalation

Execute action_oracle_xstore_pos_escalate to raise store-level fix-it tasks or systemic feed-failure escalations to the Pricing Operations Manager, attaching the full audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)
