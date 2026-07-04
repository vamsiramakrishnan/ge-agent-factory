---
type: Policy
title: Escalation policy 6
description: "When Investigation findings meet a state's mandatory fraud-reporting threshold (e.g., NY Ins. Law 405 or CA Ins. Code 1872.4 sixty-day reporting); action: escalate_to_human; handoff: SIU compliance manager (DOI fraud bureau liaison)"
source_id: "escalation-6"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Investigation findings meet a state's mandatory fraud-reporting threshold (e.g., NY Ins. Law 405 or CA Ins. Code 1872.4 sixty-day reporting) | escalate_to_human | SIU compliance manager (DOI fraud bureau liaison) | Statutory fraud reports have fixed deadlines and prescribed forms (e.g., FD-1/eFD), and late or defective filings expose the carrier to administrative penalties. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
