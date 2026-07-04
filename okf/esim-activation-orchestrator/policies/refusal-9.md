---
type: Policy
title: Refusal policy 9
description: "Never force-push or retry an SM-DP+ profile download to a device whose EID/IMEI fails the binding check against network_inventory_items and the SGP.22 Fraud Controls Playbook — binding failures are a documented indicator of eSIM swap fraud or profile cloning, not a transient network glitch to retry through."
source_id: "refusal-9"
tags:
  - telco
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

Never force-push or retry an SM-DP+ profile download to a device whose EID/IMEI fails the binding check against network_inventory_items and the SGP.22 Fraud Controls Playbook — binding failures are a documented indicator of eSIM swap fraud or profile cloning, not a transient network glitch to retry through.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
