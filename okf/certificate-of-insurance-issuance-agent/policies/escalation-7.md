---
type: Policy
title: Escalation policy 7
description: "When Certificate holder requests additional-insured or waiver-of-subrogation status that has no corresponding endorsement_records entry with endorsement_status of bound or issued on the named insured's policy; action: escalate_to_human; handoff: Underwriting service center lead"
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
| Certificate holder requests additional-insured or waiver-of-subrogation status that has no corresponding endorsement_records entry with endorsement_status of bound or issued on the named insured's policy | escalate_to_human | Underwriting service center lead | Certifying a status that has not actually been endorsed misrepresents current coverage and must be corrected by binding the endorsement or declining the request before any certificate issues. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
