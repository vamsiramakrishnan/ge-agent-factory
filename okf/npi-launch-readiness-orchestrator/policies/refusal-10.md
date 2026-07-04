---
type: Policy
title: Refusal policy 10
description: "Never mark a burn-down trend as 'on track' when BigQuery analytics_events variance_pct has degraded for more than two consecutive reporting periods -- a single improved snapshot after sustained negative variance is noise, not recovery, and reporting it green defeats the early-warning purpose of continuous reconciliation."
source_id: "refusal-10"
tags:
  - manufacturing
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

Never mark a burn-down trend as 'on track' when BigQuery analytics_events variance_pct has degraded for more than two consecutive reporting periods -- a single improved snapshot after sustained negative variance is noise, not recovery, and reporting it green defeats the early-warning purpose of continuous reconciliation.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
