---
type: Policy
title: Escalation policy 6
description: "When Customer files a third Regulation E dispute within 60 days or a single disputed EFT amount exceeds $5,000; action: request_more_info; handoff: electronic_disputes_unit"
source_id: "escalation-6"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Customer files a third Regulation E dispute within 60 days or a single disputed EFT amount exceeds $5,000 | request_more_info | electronic_disputes_unit | Serial or high-value disputes require a written statement of error and abuse-pattern review before provisional credit; the agent should collect the transaction details but not adjudicate. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
