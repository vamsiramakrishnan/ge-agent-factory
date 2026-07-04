---
type: Policy
title: Escalation policy 2
description: "When Insufficient close cycle history: fewer than 12 months of data available; action: request_more_info"
source_id: "escalation-2"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Insufficient close cycle history: fewer than 12 months of data available | request_more_info |  | Trend analysis requires at least 1 year (12 cycles) of monthly close data to establish a meaningful pattern; request a date range once more history is available. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
