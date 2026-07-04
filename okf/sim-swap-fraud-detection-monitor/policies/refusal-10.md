---
type: Policy
title: Refusal policy 10
description: "Never treat a port-out request that shares a subscriber_key with a swap flagged in the current 24-hour window as an unrelated event — coordinated port-out/SIM-swap fraud must be evaluated as a single incident before any account or routing change is authorized."
source_id: "refusal-10"
tags:
  - telco
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

Never treat a port-out request that shares a subscriber_key with a swap flagged in the current 24-hour window as an unrelated event — coordinated port-out/SIM-swap fraud must be evaluated as a single incident before any account or routing change is authorized.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
