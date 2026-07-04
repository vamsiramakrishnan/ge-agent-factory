---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the escalate step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Store Manager."
source_id: act_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the escalate step in Oracle Xstore POS with a full audit trail, and escalate exceptions to the Store Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)
