---
type: Policy
title: Escalation policy 7
description: "When An agency's weekly BigQuery historical_metrics scan shows quote volume, hit ratio, and retention all below the Agency Segmentation & Re-Engagement Playbook's At-Risk band for two consecutive weeks; action: escalate_to_human; handoff: Agency Distribution Manager"
source_id: "escalation-7"
tags:
  - insurance
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
| An agency's weekly BigQuery historical_metrics scan shows quote volume, hit ratio, and retention all below the Agency Segmentation & Re-Engagement Playbook's At-Risk band for two consecutive weeks | escalate_to_human | Agency Distribution Manager | Two consecutive weeks of tri-metric decline signals a structural agency problem (staffing, appetite mismatch, or competitor displacement) that a briefing pack and campaign nudge cannot fix -- it needs an in-person distribution manager visit, not another automated cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
