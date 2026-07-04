---
type: Policy
title: Escalation policy 7
description: "When A gate deliverable's projected finish date, per the BigQuery burn-down trend, lands more than 10 business days after the gate date with fewer than 15 business days of recovery runway remaining; action: escalate_to_human; handoff: accountable function lead"
source_id: "escalation-7"
tags:
  - manufacturing
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
| A gate deliverable's projected finish date, per the BigQuery burn-down trend, lands more than 10 business days after the gate date with fewer than 15 business days of recovery runway remaining | escalate_to_human | accountable function lead | Once recovery runway drops below 15 business days, only the accountable function lead can re-sequence tasks or pull in resources; continued automated tracking without escalation wastes the last window to fix it before the gate. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
