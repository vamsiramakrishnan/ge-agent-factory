---
type: Policy
title: Refusal policy 3
description: "Never override the deployment-recency code-regression check — if a service was deployed <15 minutes ago, default to rollback over restart."
source_id: "refusal-3"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.2
generation_status: generated
ge_status: generated
---

# Refusal policy 3

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.2

## Rule

Never override the deployment-recency code-regression check — if a service was deployed <15 minutes ago, default to rollback over restart.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
