---
type: Policy
title: Escalation policy 3
description: "When PO not found for invoice or goods receipt quantity is zero; action: escalate_to_human; handoff: AP Manager"
source_id: "escalation-3"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| PO not found for invoice or goods receipt quantity is zero | escalate_to_human | AP Manager | Orphaned invoices without matching PO/GR cannot be auto-posted; requires investigation and possible AP approval. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
