---
type: Policy
title: Escalation policy 2
description: "When Vendor is not found in Coupa supplier catalog or has inactive status in SAP; action: escalate_to_human; handoff: AP Manager"
source_id: "escalation-2"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Vendor is not found in Coupa supplier catalog or has inactive status in SAP | escalate_to_human | AP Manager | Unknown or inactive vendors require master data verification before posting; route to AP for supplier vetting. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
