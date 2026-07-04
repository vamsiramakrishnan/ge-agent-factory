---
type: Policy
title: Escalation policy 5
description: "When Client aged 65+ or with a documented trusted-contact flag requests full liquidation, a change of address plus disbursement, or a transfer to a newly added third party; action: escalate_to_human; handoff: senior_investor_protection_desk"
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
| Client aged 65+ or with a documented trusted-contact flag requests full liquidation, a change of address plus disbursement, or a transfer to a newly added third party | escalate_to_human | senior_investor_protection_desk | FINRA Rule 2165 permits a temporary hold on disbursements when financial exploitation is reasonably suspected; the hold decision and trusted-contact outreach are supervisory functions. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
