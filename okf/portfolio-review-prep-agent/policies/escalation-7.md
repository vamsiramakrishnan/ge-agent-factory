---
type: Policy
title: Escalation policy 7
description: "When A household's client_households.last_annual_review_date exceeds 15 months (the 12-month Reg BI cadence plus grace period) with no meeting scheduled in Salesforce Financial Services Cloud; action: escalate_to_human; handoff: Branch Manager"
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
| A household's client_households.last_annual_review_date exceeds 15 months (the 12-month Reg BI cadence plus grace period) with no meeting scheduled in Salesforce Financial Services Cloud | escalate_to_human | Branch Manager | Lapsed annual reviews beyond the grace window are a recurring supervisory exam finding; branch management must confirm client contact attempts before the packet is closed out. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
