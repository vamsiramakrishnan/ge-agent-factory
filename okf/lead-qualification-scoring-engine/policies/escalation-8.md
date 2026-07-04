---
type: Policy
title: Escalation policy 8
description: "When The lead's linked service_quotes record shows serviceability_confirmed as false or its valid_until date has already lapsed relative to today; action: request_more_info; handoff: network_serviceability_desk"
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
| The lead's linked service_quotes record shows serviceability_confirmed as false or its valid_until date has already lapsed relative to today | request_more_info | network_serviceability_desk | Scoring or routing a lead against unconfirmed or expired serviceability produces an install commitment the network cannot support, generating avoidable cancellations. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
