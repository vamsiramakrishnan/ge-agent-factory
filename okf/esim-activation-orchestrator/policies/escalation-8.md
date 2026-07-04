---
type: Policy
title: Escalation policy 8
description: "When Customer does not confirm completion of a handset-side recovery step (reboot or eSIM reinstall) within 30 minutes of notification and the provisioning_task remains in manual_hold; action: request_more_info; handoff: Care Agent"
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
| Customer does not confirm completion of a handset-side recovery step (reboot or eSIM reinstall) within 30 minutes of notification and the provisioning_task remains in manual_hold | request_more_info | Care Agent | Without confirmation the orchestrator cannot tell whether the device or the network is still the blocker, and closing the task without proof risks a false activation-complete state. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
