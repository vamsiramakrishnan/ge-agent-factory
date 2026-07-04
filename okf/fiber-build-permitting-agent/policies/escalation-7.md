---
type: Policy
title: Escalation policy 7
description: "When A permit's jurisdiction SLA clock, tracked against the BigQuery historical_metrics baseline, exceeds 45 days without a status change, or the associated 811 locate ticket is within 3 business days of expiring while the permit is still pending; action: escalate_to_human; handoff: Construction Program Manager"
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
| A permit's jurisdiction SLA clock, tracked against the BigQuery historical_metrics baseline, exceeds 45 days without a status change, or the associated 811 locate ticket is within 3 business days of expiring while the permit is still pending | escalate_to_human | Construction Program Manager | A near-expired locate or a permit already past the jurisdiction's turnaround baseline needs a program manager to press the jurisdiction contact or re-sequence the build segment, not another automated resubmission attempt. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
