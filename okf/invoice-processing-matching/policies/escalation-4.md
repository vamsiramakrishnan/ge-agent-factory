---
type: Policy
title: Escalation policy 4
description: "When Non-standard invoice flagged by Document AI (confidence < 85%) and Gemini interpretation fails; action: escalate_to_human; handoff: AP Manager"
source_id: "escalation-4"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Non-standard invoice flagged by Document AI (confidence < 85%) and Gemini interpretation fails | escalate_to_human | AP Manager | Handwritten or complex invoices that semantic matching cannot resolve require manual review for accuracy. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
