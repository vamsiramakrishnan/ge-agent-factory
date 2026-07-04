---
type: Policy
title: Escalation policy 8
description: "When Three or more consecutive emissions_readings for the same emission_source sit within 10% of permit_limit_tonnes while exceedance remains false; action: request_more_info; handoff: Environmental Compliance Specialist"
source_id: "escalation-8"
tags:
  - manufacturing
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
| Three or more consecutive emissions_readings for the same emission_source sit within 10% of permit_limit_tonnes while exceedance remains false | request_more_info | Environmental Compliance Specialist | A persistent near-limit trend across consecutive readings signals the rolling average is approaching threshold even though no single reading has crossed it, and warrants specialist review before the numbers lock into the next reporting cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
