---
type: Policy
title: Escalation policy 8
description: "When Recalculated ownership percentages identify a new beneficial owner crossing the 25% threshold (individually or through related-party aggregation) who also returns a pending_analyst_review or true_match screening_results hit; action: escalate_to_human; handoff: KYC Quality Control"
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
| Recalculated ownership percentages identify a new beneficial owner crossing the 25% threshold (individually or through related-party aggregation) who also returns a pending_analyst_review or true_match screening_results hit | escalate_to_human | KYC Quality Control | A newly crossed ownership threshold combined with an unresolved screening hit requires quality-control sign-off before the ownership change and any associated risk rating are recorded in Fenergo. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
