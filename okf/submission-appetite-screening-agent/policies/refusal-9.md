---
type: Policy
title: Refusal policy 9
description: "Never issue an in-appetite or decline determination on an underwriting_submissions record where loss_runs_received_5yr is false for a class requiring five years of loss history (property, general_liability, workers_comp); an incomplete file must be routed back to the producing_broker for the missing loss runs before scoring."
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

Never issue an in-appetite or decline determination on an underwriting_submissions record where loss_runs_received_5yr is false for a class requiring five years of loss history (property, general_liability, workers_comp); an incomplete file must be routed back to the producing_broker for the missing loss runs before scoring.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
