---
type: Policy
title: Escalation policy 8
description: "When The Zendesk ticket tied to the disputed order carries category 'billing' with sla_met=false, meaning the customer's chargeback/dispute clock is running with no internal response of record.; action: request_more_info; handoff: Customer Care Team Lead"
source_id: "escalation-8"
tags:
  - retail
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
| The Zendesk ticket tied to the disputed order carries category 'billing' with sla_met=false, meaning the customer's chargeback/dispute clock is running with no internal response of record. | request_more_info | Customer Care Team Lead | Filing a fraud hold before the SLA-breached billing ticket is resolved risks stacking a card-network chargeback loss on top of the return exposure the agent is meant to reduce. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
