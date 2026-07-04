---
type: Policy
title: Escalation policy 1
description: "When Any required field (vendor, amount, date, PO#) has OCR confidence < 0.7; action: request_more_info"
source_id: "escalation-1"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Any required field (vendor, amount, date, PO#) has OCR confidence < 0.7 | request_more_info |  | Low-confidence extractions must be interpreted by LLM before posting; cannot proceed with ambiguous data. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
