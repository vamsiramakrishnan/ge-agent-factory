---
type: Policy
title: Escalation policy 8
description: "When A competitor-comparison inquiry cites a policy_quotes prior_carrier premium more than 40% below the current annual_premium in policies for the same line_of_business; action: escalate_to_human; handoff: Retention Specialist supervisor"
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
| A competitor-comparison inquiry cites a policy_quotes prior_carrier premium more than 40% below the current annual_premium in policies for the same line_of_business | escalate_to_human | Retention Specialist supervisor | An implausibly low competitor quote usually signals a coverage-scope mismatch or misrepresentation; matching it without verification risks binding an unsustainable rate and adverse selection. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
