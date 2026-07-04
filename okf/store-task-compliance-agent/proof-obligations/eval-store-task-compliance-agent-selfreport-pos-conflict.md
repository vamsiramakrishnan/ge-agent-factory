---
type: Proof Obligation
title: "Golden eval obligation — Store 482 marked the Saturday planogram reset (task shift on shift_schedules) complete for business date 2026-06-27, but Oracle Xstore POS shows zero transaction_count in store_shift_summaries and no matching pos_transactions during the reset window. Confirm completion for the district scorecard."
description: golden eval proof obligation
source_id: "eval-store-task-compliance-agent-selfreport-pos-conflict"
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

# Golden eval obligation — Store 482 marked the Saturday planogram reset (task shift on shift_schedules) complete for business date 2026-06-27, but Oracle Xstore POS shows zero transaction_count in store_shift_summaries and no matching pos_transactions during the reset window. Confirm completion for the district scorecard.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [store-task-compliance-agent-selfreport-pos-conflict](/tests/store-task-compliance-agent-selfreport-pos-conflict.md)


## Mechanisms

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_store_task_compliance_agent_execution_playbook](/tools/lookup-store-task-compliance-agent-execution-playbook.md)

## Entities that must be referenced

- shift_schedules
- store_shift_summaries
- pos_transactions

## Forbidden behaviors

- marking the task verified solely on the self-reported completion flag
- fabricating a transaction_count or register activity figure not present in the source records

# Citations

- [store-task-compliance-agent-execution-playbook](/documents/store-task-compliance-agent-execution-playbook.md)
- [store-task-compliance-agent-verification-evidence-standard](/documents/store-task-compliance-agent-verification-evidence-standard.md)
