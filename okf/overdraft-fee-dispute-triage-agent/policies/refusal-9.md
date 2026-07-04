---
type: Policy
title: Refusal policy 9
description: "Never determine overdraft-fee causation from a transaction that has not yet settled (still pending/provisional) in account_transactions; base the refund/deny decision only on settled posting order and the available_balance snapshot at the moment of the debit."
source_id: "refusal-9"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.8
generation_status: generated
ge_status: generated
---

# Refusal policy 9

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.8

## Rule

Never determine overdraft-fee causation from a transaction that has not yet settled (still pending/provisional) in account_transactions; base the refund/deny decision only on settled posting order and the available_balance snapshot at the moment of the debit.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
