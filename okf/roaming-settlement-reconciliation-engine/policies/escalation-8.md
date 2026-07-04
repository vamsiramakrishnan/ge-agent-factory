---
type: Policy
title: Escalation policy 8
description: "When More than 5% of a partner's roaming_partner-tagged usage_records for the cycle have no matching rated_events (i.e., missing TAP/BCE files); action: request_more_info; handoff: mediation_operations"
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
| More than 5% of a partner's roaming_partner-tagged usage_records for the cycle have no matching rated_events (i.e., missing TAP/BCE files) | request_more_info | mediation_operations | A missing-file rate this high usually indicates a failed or unclosed mediation_batch rather than a rating discrepancy, and the mediation fault must be triaged before financial exposure is quantified against incomplete data. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
