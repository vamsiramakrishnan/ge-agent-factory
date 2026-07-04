---
type: Policy
title: Escalation policy 8
description: "When Duplicate/unbundling detection returns a match confidence below 90% against the claimant's billing history in analytics_events and historical_metrics; action: request_more_info"
source_id: "escalation-8"
tags:
  - insurance
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
| Duplicate/unbundling detection returns a match confidence below 90% against the claimant's billing history in analytics_events and historical_metrics | request_more_info |  | Low-confidence duplicate flags risk denying legitimate treatment; the adjuster must manually confirm against the source bill image before any reduce/deny recommendation is issued. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
