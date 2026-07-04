---
type: Policy
title: Escalation policy 7
description: "When A non-renew recommendation would be issued for a policy where fewer than 65 days remain before expiration_date in a jurisdiction_state carrying a 60-day (or longer) statutory non-renewal notice requirement; action: escalate_to_human; handoff: Renewal underwriting supervisor"
source_id: "escalation-7"
tags:
  - insurance
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
| A non-renew recommendation would be issued for a policy where fewer than 65 days remain before expiration_date in a jurisdiction_state carrying a 60-day (or longer) statutory non-renewal notice requirement | escalate_to_human | Renewal underwriting supervisor | Missing the statutory notice window forces automatic renewal regardless of the risk assessment, so any account inside that window needs a supervisor decision on interim treatment (e.g., renew-as-is with mid-term re-underwriting) rather than a routed non-renew. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
