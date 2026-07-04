---
type: Policy
title: Escalation policy 5
description: "When Same provisioning task fails on the same order 3 or more times (retry_count >= 3) with the same error_code; action: request_more_info; handoff: provisioning_engineering"
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
| Same provisioning task fails on the same order 3 or more times (retry_count >= 3) with the same error_code | request_more_info | provisioning_engineering | Three identical failures indicate a data or network-element configuration defect the flow-through engine cannot resolve; blind retries only widen the fallout window. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
