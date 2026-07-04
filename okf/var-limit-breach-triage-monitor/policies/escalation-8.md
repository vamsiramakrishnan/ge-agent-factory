---
type: Policy
title: Escalation policy 8
description: "When A single contributing trade's notional_amount exceeds 25% of the breaching risk_measures.approved_limit_value for that measure_type; action: request_more_info; handoff: Market Risk Analyst"
source_id: "escalation-8"
tags:
  - banking
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
| A single contributing trade's notional_amount exceeds 25% of the breaching risk_measures.approved_limit_value for that measure_type | request_more_info | Market Risk Analyst | Breach concentration in one trade suggests a booking or hedge-designation error rather than genuine risk-taking, and must be confirmed against Murex MX.3 trades before the root-cause narrative is finalized. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
