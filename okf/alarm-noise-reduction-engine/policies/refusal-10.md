---
type: Policy
title: Refusal policy 10
description: "Never close out a correlated case as resolved when the linked alert_actions record shows sla_met=false or a status other than resolved/closed — the Splunk ticket state is the system of record for closure, not the network_alarms clear_status flag alone."
source_id: "refusal-10"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Never close out a correlated case as resolved when the linked alert_actions record shows sla_met=false or a status other than resolved/closed — the Splunk ticket state is the system of record for closure, not the network_alarms clear_status flag alone.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
