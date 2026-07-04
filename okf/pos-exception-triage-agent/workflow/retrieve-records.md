---
type: Workflow Stage
title: Retrieve Records
description: Query pos transactions and tender records from Oracle Xstore POS and correlate with Zendesk for the POS Exception Triage Agent workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query pos transactions and tender records from Oracle Xstore POS and correlate with Zendesk for the POS Exception Triage Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
