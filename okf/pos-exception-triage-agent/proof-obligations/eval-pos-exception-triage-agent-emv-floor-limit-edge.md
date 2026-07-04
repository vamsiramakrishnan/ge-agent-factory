---
type: Proof Obligation
title: "Golden eval obligation — Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift."
description: golden eval proof obligation
source_id: "eval-pos-exception-triage-agent-emv-floor-limit-edge"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [pos-exception-triage-agent-emv-floor-limit-edge](/tests/pos-exception-triage-agent-emv-floor-limit-edge.md)


## Mechanisms

- [query_oracle_xstore_pos_tender_records](/tools/query-oracle-xstore-pos-tender-records.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

## Entities that must be referenced

- tender_records
- pos_transactions
- tickets

## Forbidden behaviors

- closing or auto-resolving ticket 88213 without checking the floor limit
- fabricating a floor-limit dollar figure not sourced from the bulletin

# Citations

- [pos-exception-triage-agent-execution-playbook](/documents/pos-exception-triage-agent-execution-playbook.md)
- [emv-fallback-offline-auth-bulletin](/documents/emv-fallback-offline-auth-bulletin.md)
