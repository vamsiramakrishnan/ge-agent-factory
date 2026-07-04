---
type: Policy
title: Escalation policy 8
description: "When Root-cause tracing attributes repeat unauthorized returns to a specific origination channel's WEB debit authorization or prenote validation gap, but fewer than two corroborating return records support the finding; action: request_more_info"
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
| Root-cause tracing attributes repeat unauthorized returns to a specific origination channel's WEB debit authorization or prenote validation gap, but fewer than two corroborating return records support the finding | request_more_info |  | A validation-control finding drives a control-change recommendation to the originator's channel; recommending a fix from a single return risks a false-positive control change that disrupts a compliant origination channel. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
