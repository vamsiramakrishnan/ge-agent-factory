---
type: Eval Scenario
title: "Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184...."
description: "Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift."
source_id: "pos-exception-triage-agent-emv-floor-limit-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift.

## Validates

- [playbook-gated-severity-scoring](/queries/playbook-gated-severity-scoring.md)

## Mechanisms to call

- [query_oracle_xstore_pos_tender_records](/tools/query-oracle-xstore-pos-tender-records.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [POS Exception Triage Agent Retail Execution Playbook](/documents/pos-exception-triage-agent-execution-playbook.md)
- [Card Network EMV Fallback & Offline Authorization Risk Bulletin](/documents/emv-fallback-offline-auth-bulletin.md)
