---
type: Policy
title: Refusal policy 10
description: "Never recommend releasing a held bill cycle until the tax_jurisdiction and zero_rated flags on every in-scope rated_events row have been re-verified post-fix — releasing on a partial fix reproduces the mass-rebill event this agent was built to prevent."
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

Never recommend releasing a held bill cycle until the tax_jurisdiction and zero_rated flags on every in-scope rated_events row have been re-verified post-fix — releasing on a partial fix reproduces the mass-rebill event this agent was built to prevent.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
