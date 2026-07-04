---
type: Policy
title: Escalation policy 8
description: "When The null search result rate for a single top-100 query term persists above 8% for more than 7 consecutive days despite an active remediation rule; action: escalate_to_human; handoff: Digital Merchandising Manager"
source_id: "escalation-8"
tags:
  - retail
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
| The null search result rate for a single top-100 query term persists above 8% for more than 7 consecutive days despite an active remediation rule | escalate_to_human | Digital Merchandising Manager | A rule that isn't closing the gap after a week signals either a real assortment hole or a mis-scoped rule, and needs merchandising judgment rather than another automated iteration. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
