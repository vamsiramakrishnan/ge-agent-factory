---
type: Policy
title: Escalation policy 8
description: "When fuzzy_match_score falls between 85 and 94 on a hit tied to an entity_profiles record with naics_risk_tier = high_risk_program or cash_intensive_business = true; action: request_more_info; handoff: Senior Sanctions Screening Analyst"
source_id: "escalation-8"
tags:
  - banking
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
| fuzzy_match_score falls between 85 and 94 on a hit tied to an entity_profiles record with naics_risk_tier = high_risk_program or cash_intensive_business = true | request_more_info | Senior Sanctions Screening Analyst | Mid-band scores on higher-risk entity profiles need secondary human review before either clearing or escalating, per the compliance policy's disposition thresholds. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
