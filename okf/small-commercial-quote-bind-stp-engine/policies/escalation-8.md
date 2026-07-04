---
type: Policy
title: Escalation policy 8
description: "When The requested_effective_date is more than 30 days out or the linked policy_quotes record already carries quote_status = expired_30_day; action: refuse; handoff: Producing broker / agency of record"
source_id: "escalation-8"
tags:
  - insurance
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
| The requested_effective_date is more than 30 days out or the linked policy_quotes record already carries quote_status = expired_30_day | refuse | Producing broker / agency of record | Guidewire PolicyCenter's 30-day quote validity window requires a fresh rating run; binding an expired quote uses stale filed rates and breaks rate-currency requirements. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
