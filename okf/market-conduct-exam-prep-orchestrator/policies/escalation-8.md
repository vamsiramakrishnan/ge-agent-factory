---
type: Policy
title: Escalation policy 8
description: "When Fewer than 5 business days remain before the examiner data-call deadline and reconciliation between policies and the BigQuery analytics_events baseline is still incomplete; action: request_more_info; handoff: Regulatory Affairs Manager"
source_id: "escalation-8"
tags:
  - insurance
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
| Fewer than 5 business days remain before the examiner data-call deadline and reconciliation between policies and the BigQuery analytics_events baseline is still incomplete | request_more_info | Regulatory Affairs Manager | Submitting a data-call package against unreconciled records risks a data-integrity finding that is worse than a short, disclosed extension request. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
