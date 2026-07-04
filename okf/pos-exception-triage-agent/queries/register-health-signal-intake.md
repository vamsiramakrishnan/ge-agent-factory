---
type: Query Capability
title: "Poll Oracle Xstore POS pos_transactions, tender_records, and store_shift_summ..."
description: "Poll Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries for the failure signatures (void spikes, offline auth flags, dead registers) that precede an associate calling the help desk."
source_id: "register-health-signal-intake"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Poll Oracle Xstore POS pos_transactions, tender_records, and store_shift_summaries for the failure signatures (void spikes, offline auth flags, dead registers) that precede an associate calling the help desk.

## Tools used

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [action_oracle_xstore_pos_escalate](/tools/action-oracle-xstore-pos-escalate.md)

## Runs in

- [register_health_signal_intake](/workflow/register-health-signal-intake.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the POS Exception Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pos-exception-triage-agent-end-to-end.md)
- [Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift.](/tests/pos-exception-triage-agent-emv-floor-limit-edge.md)

# Citations

- [POS Exception Triage Agent Retail Execution Playbook](/documents/pos-exception-triage-agent-execution-playbook.md)
- [Card Network EMV Fallback & Offline Authorization Risk Bulletin](/documents/emv-fallback-offline-auth-bulletin.md)
