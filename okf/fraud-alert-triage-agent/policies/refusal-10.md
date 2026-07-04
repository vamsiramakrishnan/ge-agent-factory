---
type: Policy
title: Refusal policy 10
description: "Never auto-close a fraud_alerts record as false_positive when the linked transaction_risk_scores record shows mule_account_indicator true or score_band critical; the elevated signal must be reconciled by an analyst before any benign disposition is recorded."
source_id: "refusal-10"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Never auto-close a fraud_alerts record as false_positive when the linked transaction_risk_scores record shows mule_account_indicator true or score_band critical; the elevated signal must be reconciled by an analyst before any benign disposition is recorded.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
