---
type: Policy
title: Escalation policy 5
description: "When OCR and LLM interpretations disagree on extracted value; action: request_more_info"
source_id: "escalation-5"
tags:
  - procurement
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
| OCR and LLM interpretations disagree on extracted value | request_more_info |  | Conflicting interpretations indicate ambiguity; request clarification from AP or supplier before posting. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
