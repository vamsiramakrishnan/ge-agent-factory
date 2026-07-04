---
type: Eval Scenario
title: Store 1187 register 14 has had three Zendesk tickets opened in the last 24 ho...
description: "Store 1187 register 14 has had three Zendesk tickets opened in the last 24 hours (#91004 P2 hardware, #91011 P3 hardware, #91022 P1 hardware). The store_shift_summaries record for the 2026-07-03 closing shift shows a cash_over_short of -$62.40 on that till, and the most recent BigQuery historical_metrics refresh for this store is dated 2026-06-28. Diagnose whether this is a hardware pattern worth a field-tech dispatch, and tell me if the baseline is fresh enough to act on."
source_id: "pos-exception-triage-agent-repeat-register-stale-baseline"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store 1187 register 14 has had three Zendesk tickets opened in the last 24 hours (#91004 P2 hardware, #91011 P3 hardware, #91022 P1 hardware). The store_shift_summaries record for the 2026-07-03 closing shift shows a cash_over_short of -$62.40 on that till, and the most recent BigQuery historical_metrics refresh for this store is dated 2026-06-28. Diagnose whether this is a hardware pattern worth a field-tech dispatch, and tell me if the baseline is fresh enough to act on.

## Validates

- [ticket-correlation-dedup](/queries/ticket-correlation-dedup.md)

## Mechanisms to call

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_oracle_xstore_pos_store_shift_summaries](/tools/query-oracle-xstore-pos-store-shift-summaries.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [POS Exception Triage Agent Retail Execution Playbook](/documents/pos-exception-triage-agent-execution-playbook.md)
