---
type: Policy
title: Escalation policy 5
description: "When Sanctions screening returns a fuzzy-match score of 85 or higher against OFAC SDN or NS-CMIC lists; action: refuse; handoff: sanctions_compliance_officer"
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
| Sanctions screening returns a fuzzy-match score of 85 or higher against OFAC SDN or NS-CMIC lists | refuse | sanctions_compliance_officer | High-confidence potential matches must be held and dispositioned by the sanctions officer; processing before disposition risks a strict-liability OFAC violation with per-transaction penalties. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
