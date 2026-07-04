---
type: Policy
title: Escalation policy 4
description: "When Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship; action: escalate_to_human; handoff: bsa_officer"
source_id: "escalation-4"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship | escalate_to_human | bsa_officer | Sub-threshold clustering just under the $10,000 CTR trigger is the canonical structuring typology; SAR decisioning authority rests solely with the BSA officer and the 30-day filing clock may already be running. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
