---
type: Policy
title: Escalation policy 7
description: "When An emerging complaint cluster identified from analytics_events spans three or more queue_metrics.queue_name segments within the same 48-hour window; action: escalate_to_human; handoff: network operations / product engineering duty manager"
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
| An emerging complaint cluster identified from analytics_events spans three or more queue_metrics.queue_name segments within the same 48-hour window | escalate_to_human | network operations / product engineering duty manager | A cluster spanning multiple queues simultaneously signals a cross-regional platform, bill-run, or firmware defect rather than an isolated queue issue, and needs engineering triage authority the Care Team Lead doesn't have. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
