---
type: Policy
title: Escalation policy 8
description: "When Three or more SIM swap holds are placed on the same subscriber_key within a rolling 30-day window; action: escalate_to_human; handoff: Fraud Operations Analyst"
source_id: "escalation-8"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Three or more SIM swap holds are placed on the same subscriber_key within a rolling 30-day window | escalate_to_human | Fraud Operations Analyst | Repeated swap attempts on one subscriber_key are the signature of a sustained account-takeover campaign, not device churn, and warrant case consolidation rather than independent per-event handling. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
