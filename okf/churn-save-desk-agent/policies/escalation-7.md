---
type: Policy
title: Escalation policy 7
description: "When customer_interactions.intent is cancel_request and the paired queue_metrics record for that queue/date shows service_level_80_20_pct under 55% with abandon_rate_pct over 8%, indicating a service-quality churn driver rather than price; action: escalate_to_human; handoff: network_assurance_liaison"
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
| customer_interactions.intent is cancel_request and the paired queue_metrics record for that queue/date shows service_level_80_20_pct under 55% with abandon_rate_pct over 8%, indicating a service-quality churn driver rather than price | escalate_to_human | network_assurance_liaison | Offering a price-based save when the true driver is a service shortfall wastes discount budget and does not fix the churn cause; the account needs a tracked service-remediation commitment, not just a lower bill. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
