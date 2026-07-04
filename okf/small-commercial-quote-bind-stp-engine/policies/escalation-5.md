---
type: Policy
title: Escalation policy 5
description: "When OFAC SDN or sanctions screening returns a potential match on the applicant, any named insured, or a beneficial owner; action: refuse; handoff: Corporate sanctions compliance officer"
source_id: "escalation-5"
tags:
  - insurance
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
| OFAC SDN or sanctions screening returns a potential match on the applicant, any named insured, or a beneficial owner | refuse | Corporate sanctions compliance officer | Binding coverage for a sanctioned party violates federal OFAC regulations carrying strict-liability civil penalties; only compliance may clear or block the match. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
