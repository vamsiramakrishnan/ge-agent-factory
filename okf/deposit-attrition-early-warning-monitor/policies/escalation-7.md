---
type: Policy
title: Escalation policy 7
description: "When A single household's aggregated at-risk balance across linked core_accounts exceeds $250,000, or its attrition risk score sits in the top 1% of the weekly cohort; action: escalate_to_human; handoff: Retail Deposits Relationship Manager"
source_id: "escalation-7"
tags:
  - banking
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
| A single household's aggregated at-risk balance across linked core_accounts exceeds $250,000, or its attrition risk score sits in the top 1% of the weekly cohort | escalate_to_human | Retail Deposits Relationship Manager | Large-balance relationships warrant a human-led retention conversation and possible officer-level rate exception rather than an automated blanket offer. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
