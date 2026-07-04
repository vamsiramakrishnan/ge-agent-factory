---
type: Policy
title: Escalation policy 5
description: "When Any strike on third-party utilities, gas odor, downed energized line, vehicle incident, or technician injury reported from a job site; action: refuse; handoff: safety_incident_officer"
source_id: "escalation-5"
tags:
  - telco
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
| Any strike on third-party utilities, gas odor, downed energized line, vehicle incident, or technician injury reported from a job site | refuse | safety_incident_officer | Safety events stop all further work-order processing at that site immediately; incident command, utility-owner notification, and regulator reporting obligations take over and the agent must not route around them. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
