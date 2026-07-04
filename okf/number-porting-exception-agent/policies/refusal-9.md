---
type: Policy
title: Refusal policy 9
description: "Never process a port-in resubmission against a CSR record older than the losing carrier's most recent NPAC snapshot — resubmitting against a stale CSR reproduces the same reject code and burns another regulatory interval cycle."
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

Never process a port-in resubmission against a CSR record older than the losing carrier's most recent NPAC snapshot — resubmitting against a stale CSR reproduces the same reject code and burns another regulatory interval cycle.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
