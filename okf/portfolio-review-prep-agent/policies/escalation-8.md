---
type: Policy
title: Escalation policy 8
description: "When BigQuery analytics_events variance_pct against the historical_metrics baseline exceeds 2 standard deviations for a household where client_households.accredited_investor is false; action: request_more_info; handoff: Portfolio Construction Desk"
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
| BigQuery analytics_events variance_pct against the historical_metrics baseline exceeds 2 standard deviations for a household where client_households.accredited_investor is false | request_more_info | Portfolio Construction Desk | Large unexplained drift for a non-accredited household needs desk-level review before it is presented as a client-specific rebalancing need rather than model or data noise. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
