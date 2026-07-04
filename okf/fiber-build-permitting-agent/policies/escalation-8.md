---
type: Policy
title: Escalation policy 8
description: "When Two consecutive rejections on the same field_work_orders premise_id citing conflicting traffic-control plans or jurisdiction application-format errors; action: request_more_info; handoff: jurisdiction_permitting_coordinator"
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
| Two consecutive rejections on the same field_work_orders premise_id citing conflicting traffic-control plans or jurisdiction application-format errors | request_more_info | jurisdiction_permitting_coordinator | Repeated rejections on the same site usually mean the rules library is stale for that jurisdiction; the coordinator who holds current tribal knowledge for that municipality must confirm the correct format before a third submission burns more SLA clock. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
