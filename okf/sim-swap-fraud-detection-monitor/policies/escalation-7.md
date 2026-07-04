---
type: Policy
title: Escalation policy 7
description: "When A held SIM swap remains in step-up-verification status for more than 4 hours without a subscriber contact attempt recorded in log_events; action: request_more_info; handoff: Fraud Operations Analyst"
source_id: "escalation-7"
tags:
  - telco
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
| A held SIM swap remains in step-up-verification status for more than 4 hours without a subscriber contact attempt recorded in log_events | request_more_info | Fraud Operations Analyst | An unresolved hold beyond 4 hours risks either abandoning a legitimate customer mid-upgrade or leaving a live takeover attempt unaddressed; the analyst must confirm outreach status before the hold ages further. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
