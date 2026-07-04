---
type: Policy
title: Escalation policy 7
description: "When client_households.last_annual_review_date is more than 12 months old at the time a next-best-action recommendation would touch a risk_tolerance-sensitive product such as an annuity, alternative investment, or 401k rollover; action: request_more_info; handoff: Relationship Manager"
source_id: "escalation-7"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| client_households.last_annual_review_date is more than 12 months old at the time a next-best-action recommendation would touch a risk_tolerance-sensitive product such as an annuity, alternative investment, or 401k rollover | request_more_info | Relationship Manager | Reg BI's best-interest obligation depends on a current customer profile; recommending suitability-sensitive products against a stale annual review risks a documented suitability failure. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
