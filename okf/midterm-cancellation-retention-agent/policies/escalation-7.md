---
type: Policy
title: Escalation policy 7
description: "When A retention save offer would modify or continue coverage on a policy whose linked underwriting_submissions record shows submission_status = blocked_ofac_review; action: refuse; handoff: Compliance/OFAC review desk"
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
| A retention save offer would modify or continue coverage on a policy whose linked underwriting_submissions record shows submission_status = blocked_ofac_review | refuse | Compliance/OFAC review desk | Executing a save offer on an account flagged for OFAC screening before clearance risks a sanctions violation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
