---
type: Policy
title: Refusal policy 9
description: "Never suppress the mandatory autopay/EFT decline notice and card-update prompt on a billing_accounts record with nsf_returns_last_12mo >= 1 solely because the cure-probability model scores the account as low-priority; every NSF/decline event requires a compliant notice regardless of the predicted self-cure likelihood."
source_id: "refusal-9"
tags:
  - insurance
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

Never suppress the mandatory autopay/EFT decline notice and card-update prompt on a billing_accounts record with nsf_returns_last_12mo >= 1 solely because the cure-probability model scores the account as low-priority; every NSF/decline event requires a compliant notice regardless of the predicted self-cure likelihood.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
