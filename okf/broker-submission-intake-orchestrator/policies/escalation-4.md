---
type: Policy
title: Escalation policy 4
description: "When Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence; action: escalate_to_human; handoff: Home office referral underwriter (large-account authority)"
source_id: "escalation-4"
tags:
  - insurance
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
| Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence | escalate_to_human | Home office referral underwriter (large-account authority) | Limits above the underwriter letter-of-authority grid require sign-off from a referral underwriter because they can exceed treaty reinsurance capacity and net retention appetite. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
