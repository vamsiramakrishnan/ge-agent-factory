---
type: Policy
title: Escalation policy 8
description: "When performance_counters for the reporting period contain fewer than 80% of the expected interval_start records for a contracted slice; action: request_more_info; handoff: noc_tier2_monitoring"
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
| performance_counters for the reporting period contain fewer than 80% of the expected interval_start records for a contracted slice | request_more_info | noc_tier2_monitoring | Incomplete counter coverage cannot support a defensible SLA compliance claim or credit calculation; the agent must confirm telemetry pipeline health before reporting against partial data. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
