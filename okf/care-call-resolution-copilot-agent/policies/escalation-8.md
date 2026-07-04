---
type: Policy
title: Escalation policy 8
description: "When The Zendesk macro selected for the ticket's category does not match the intent captured on the live customer_interactions record; action: request_more_info; handoff: quality_assurance_lead"
source_id: "escalation-8"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| The Zendesk macro selected for the ticket's category does not match the intent captured on the live customer_interactions record | request_more_info | quality_assurance_lead | Applying a mismatched macro produces the wrong disposition code and buries the true root cause in later reporting; a QA lead confirms the intent-to-category mapping before the copilot proceeds. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
