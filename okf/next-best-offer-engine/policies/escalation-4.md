---
type: Policy
title: Escalation policy 4
description: "When A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline.; action: escalate_to_human; handoff: loyalty_fraud_team"
source_id: "escalation-4"
tags:
  - retail
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
| A single loyalty account redeems more than 50,000 points in 24 hours, or account point-earn velocity exceeds 10x its trailing-90-day baseline. | escalate_to_human | loyalty_fraud_team | Velocity anomalies at that scale match account-takeover and points-mule patterns; the account should be frozen and investigated, not auto-adjusted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
