---
type: Policy
title: Escalation policy 6
description: "When Usage records sitting in suspense/unguided status for more than 48 hours, or a mediation batch that failed to close; action: request_more_info; handoff: mediation_operations"
source_id: "escalation-6"
tags:
  - telco
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
| Usage records sitting in suspense/unguided status for more than 48 hours, or a mediation batch that failed to close | request_more_info | mediation_operations | Suspense aging past 48 hours risks events falling outside the billable window entirely — permanent leakage — so the guiding failure cause (bad rating group, missing subscriber reference) must be identified before bulk reprocessing. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
