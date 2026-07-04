---
type: Policy
title: Escalation policy 5
description: "When Cell availability below 99% for any market over a rolling market-day, or any outage projected to reach the Part 4 reporting threshold (900,000 user-minutes or 911-affecting); action: escalate_to_human; handoff: outage_management_office"
source_id: "escalation-5"
tags:
  - telco
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
| Cell availability below 99% for any market over a rolling market-day, or any outage projected to reach the Part 4 reporting threshold (900,000 user-minutes or 911-affecting) | escalate_to_human | outage_management_office | Availability at that level implies a reportable or SLA-relevant event; the outage office must evaluate NORS notification clocks (120-minute initial for 911-affecting outages) which the agent must not run down silently. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
