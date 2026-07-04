---
type: Policy
title: Escalation policy 7
description: "When zero_rated=true records within a single mediation_batch exceed 3x the trailing 7-day average for that rate_plan_code immediately following a catalog push; action: escalate_to_human; handoff: Product & Pricing Governance"
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
| zero_rated=true records within a single mediation_batch exceed 3x the trailing 7-day average for that rate_plan_code immediately following a catalog push | escalate_to_human | Product & Pricing Governance | A mass zero-rating spike gives away billable usage and is the exact failure signature of a bad tariff push; the catalog owner must confirm the change before any automated recommendation runs against production records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
