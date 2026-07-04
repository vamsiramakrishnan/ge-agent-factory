---
type: Policy
title: Escalation policy 5
description: "When Emissions reading with exceedance=true against the source's Title V permit limit; action: escalate_to_human; handoff: environmental_engineer"
source_id: "escalation-5"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Emissions reading with exceedance=true against the source's Title V permit limit | escalate_to_human | environmental_engineer | Permit exceedances start a regulatory clock — prompt deviation reporting to the agency, root cause, and corrective action documentation, all of which carry enforcement exposure if late. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
