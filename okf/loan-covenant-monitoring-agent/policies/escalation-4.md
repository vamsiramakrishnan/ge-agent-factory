---
type: Policy
title: Escalation policy 4
description: "When Aggregate committed exposure to the borrower and its obligor group would exceed the house limit of $10,000,000 or any single advance exceeds 15% of unimpaired capital (legal lending limit); action: escalate_to_human; handoff: credit_committee_secretary"
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
| Aggregate committed exposure to the borrower and its obligor group would exceed the house limit of $10,000,000 or any single advance exceeds 15% of unimpaired capital (legal lending limit) | escalate_to_human | credit_committee_secretary | House and legal lending limits are board-approved concentrations; only credit committee can approve exposure above them, and legal lending limit breaches are reportable to examiners. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
