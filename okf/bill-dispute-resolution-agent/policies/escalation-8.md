---
type: Policy
title: Escalation policy 8
description: "When Resolving the dispute would require changing the rate_plan_code, redetermining tax_jurisdiction, or altering zero_rated status on a rated_events record; action: refuse; handoff: product & pricing governance / tax engine team"
source_id: "escalation-8"
tags:
  - telco
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
| Resolving the dispute would require changing the rate_plan_code, redetermining tax_jurisdiction, or altering zero_rated status on a rated_events record | refuse | product & pricing governance / tax engine team | Rate-plan and tax-jurisdiction determinations are owned outside billing operations; the agent may cite the discrepancy but must not modify catalog, pricing, or tax logic itself. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
