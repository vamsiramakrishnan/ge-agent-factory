---
type: Policy
title: Escalation policy 5
description: "When Payment block flag set in SAP for vendor or PO; action: refuse"
source_id: "escalation-5"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Payment block flag set in SAP for vendor or PO | refuse |  | Do not post to payment queue when a payment block is active; route to AP Manager to resolve the block first. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
