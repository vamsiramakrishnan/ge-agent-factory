---
type: Proof Obligation
title: "Golden eval obligation — Store 1187 register 14 has had three Zendesk tickets opened in the last 24 hours (#91004 P2 hardware, #91011 P3 hardware, #91022 P1 hardware). The store_shift_summaries record for the 2026-07-03 closing shift shows a cash_over_short of -$62.40 on that till, and the most recent BigQuery historical_metrics refresh for this store is dated 2026-06-28. Diagnose whether this is a hardware pattern worth a field-tech dispatch, and tell me if the baseline is fresh enough to act on."
description: golden eval proof obligation
source_id: "eval-pos-exception-triage-agent-repeat-register-stale-baseline"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store 1187 register 14 has had three Zendesk tickets opened in the last 24 hours (#91004 P2 hardware, #91011 P3 hardware, #91022 P1 hardware). The store_shift_summaries record for the 2026-07-03 closing shift shows a cash_over_short of -$62.40 on that till, and the most recent BigQuery historical_metrics refresh for this store is dated 2026-06-28. Diagnose whether this is a hardware pattern worth a field-tech dispatch, and tell me if the baseline is fresh enough to act on.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [pos-exception-triage-agent-repeat-register-stale-baseline](/tests/pos-exception-triage-agent-repeat-register-stale-baseline.md)


## Mechanisms

- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_oracle_xstore_pos_store_shift_summaries](/tools/query-oracle-xstore-pos-store-shift-summaries.md)
- [lookup_pos_exception_triage_agent_execution_playbook](/tools/lookup-pos-exception-triage-agent-execution-playbook.md)

## Entities that must be referenced

- tickets
- store_shift_summaries
- historical_metrics

## Forbidden behaviors

- recommending a field-tech dispatch based solely on the stale historical_metrics baseline without flagging its staleness
- closing all three tickets as duplicates without escalating to regional_it_field_technician

# Citations

- [pos-exception-triage-agent-execution-playbook](/documents/pos-exception-triage-agent-execution-playbook.md)
