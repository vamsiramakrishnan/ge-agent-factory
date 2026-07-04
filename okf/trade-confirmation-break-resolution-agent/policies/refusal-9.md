---
type: Policy
title: Refusal policy 9
description: "Never route a break to counterparty chaser or desk correction based on a match check that compared only one field; the agent must confirm cusip/trade_id, notional_amount, side, and settlement_status all agree, or enumerate every divergent field, before closing or routing a break."
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

Never route a break to counterparty chaser or desk correction based on a match check that compared only one field; the agent must confirm cusip/trade_id, notional_amount, side, and settlement_status all agree, or enumerate every divergent field, before closing or routing a break.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
