---
type: Policy
title: Escalation policy 7
description: "When The remote diagnostic battery returns conflicting results (e.g., provisioning check passes but the line test fails, or vice versa) on a P1 or P2 priority ticket; action: request_more_info; handoff: noc_diagnostics_team"
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
| The remote diagnostic battery returns conflicting results (e.g., provisioning check passes but the line test fails, or vice versa) on a P1 or P2 priority ticket | request_more_info | noc_diagnostics_team | Conflicting diagnostic signals on a high-priority ticket risk closing a real outage as a false positive; a second diagnostic pass or NOC review is required before recommending remote-only closure. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
