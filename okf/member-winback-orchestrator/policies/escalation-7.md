---
type: Policy
title: Escalation policy 7
description: "When Segment-inferred lapse reason for a cohort is 'price churn' but BigQuery historical_metrics shows that cohort's average basket size is more than 30% above the store's median — the inferred reason likely reflects a mis-scored signal, not price sensitivity.; action: request_more_info; handoff: Retention Marketing Manager"
source_id: "escalation-7"
tags:
  - retail
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
| Segment-inferred lapse reason for a cohort is 'price churn' but BigQuery historical_metrics shows that cohort's average basket size is more than 30% above the store's median — the inferred reason likely reflects a mis-scored signal, not price sensitivity. | request_more_info | Retention Marketing Manager | Acting on a mis-scored lapse-reason segment wastes offer budget and can push a genuinely price-insensitive high-value member into an unnecessary discount ladder. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
