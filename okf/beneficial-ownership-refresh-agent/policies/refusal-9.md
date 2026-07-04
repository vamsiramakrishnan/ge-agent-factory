---
type: Policy
title: Refusal policy 9
description: "Never mark a beneficial-ownership refresh complete based on corporate registry data alone; entity_profiles.fincen_boi_verified must be independently confirmed against the FinCEN BOI database before action_fenergo_clm_file fires, per 31 CFR 1010.230 and the BOI Verification Runbook."
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

Never mark a beneficial-ownership refresh complete based on corporate registry data alone; entity_profiles.fincen_boi_verified must be independently confirmed against the FinCEN BOI database before action_fenergo_clm_file fires, per 31 CFR 1010.230 and the BOI Verification Runbook.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
