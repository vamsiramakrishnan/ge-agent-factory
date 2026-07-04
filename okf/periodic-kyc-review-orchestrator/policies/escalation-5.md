---
type: Policy
title: Escalation policy 5
description: "When Onboarding or refresh surfaces a PEP association, a beneficial owner in a FATF high-risk jurisdiction, or an undisclosed MSB operating through a commercial account; action: request_more_info; handoff: edd_team"
source_id: "escalation-5"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
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
| Onboarding or refresh surfaces a PEP association, a beneficial owner in a FATF high-risk jurisdiction, or an undisclosed MSB operating through a commercial account | request_more_info | edd_team | These profiles require enhanced due diligence (source of wealth, expected activity corroboration) before the relationship can be risk-rated; the agent gathers documents but cannot approve high-risk relationships. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
