---
type: Policy
title: Refusal policy 9
description: "Never retire or loosen a detection rule's threshold based on a single backtest cycle without confirming the sample includes at least one full quarter of confirmed_fraud dispositions in fraud_alerts; a partial week of data cannot distinguish genuine rule decay from statistical noise."
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

Never retire or loosen a detection rule's threshold based on a single backtest cycle without confirming the sample includes at least one full quarter of confirmed_fraud dispositions in fraud_alerts; a partial week of data cannot distinguish genuine rule decay from statistical noise.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
