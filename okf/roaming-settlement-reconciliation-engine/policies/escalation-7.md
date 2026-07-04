---
type: Policy
title: Escalation policy 7
description: "When A single roaming partner's cumulative discrepancy exposure across rated_events for the current settlement cycle exceeds $50,000; action: escalate_to_human; handoff: wholesale_partner_manager"
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
| A single roaming partner's cumulative discrepancy exposure across rated_events for the current settlement cycle exceeds $50,000 | escalate_to_human | wholesale_partner_manager | Exposure at this scale converts a routine reconciliation note into a formal partner claim under the GSMA Data Clearing House agreement, which requires partner-relationship sign-off before the dispute package is submitted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
