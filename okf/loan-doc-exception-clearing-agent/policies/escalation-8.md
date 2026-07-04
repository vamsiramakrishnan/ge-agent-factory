---
type: Policy
title: Escalation policy 8
description: "When A DocuSign envelope carrying a borrower cure item (UCC-3 amendment or insurance certificate) shows status 'expired' with no replacement envelope initiated within 5 business days; action: request_more_info; handoff: Relationship Manager"
source_id: "escalation-8"
tags:
  - banking
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
| A DocuSign envelope carrying a borrower cure item (UCC-3 amendment or insurance certificate) shows status 'expired' with no replacement envelope initiated within 5 business days | request_more_info | Relationship Manager | An expired cure envelope with no re-send means the exception is silently aging; the relationship manager must confirm the borrower is still engaged before the agent re-drafts or escalates. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
