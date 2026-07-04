---
type: Policy
title: Escalation policy 8
description: "When A claimed fee exception for a client_households record cannot be matched to a dated, signed entry in the Advisory Fee Schedule & Breakpoint Rate Manual's exception approval log; action: request_more_info; handoff: primary_advisor"
source_id: "escalation-8"
tags:
  - banking
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
| A claimed fee exception for a client_households record cannot be matched to a dated, signed entry in the Advisory Fee Schedule & Breakpoint Rate Manual's exception approval log | request_more_info | primary_advisor | An unverified exception cannot be distinguished from an undocumented discount, and billing on it risks both client overcharge or undercharge and an audit finding. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
