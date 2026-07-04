---
type: Policy
title: Escalation policy 6
description: "When High-risk-rated customer's periodic review is more than 30 days past its due date and the customer requests new products or limit increases; action: refuse; handoff: kyc_quality_control"
source_id: "escalation-6"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| High-risk-rated customer's periodic review is more than 30 days past its due date and the customer requests new products or limit increases | refuse | kyc_quality_control | Expanding a relationship with stale high-risk due diligence contradicts the risk-based CDD program the examiners test against; the review must be completed or the relationship restricted first. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
