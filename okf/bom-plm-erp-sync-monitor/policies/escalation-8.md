---
type: Policy
title: Escalation policy 8
description: "When A cad_document_records entry linked to the discrepant bom_revisions shows checked_out = true past the effectivity_date on the associated engineering_change_orders; action: request_more_info; handoff: release_engineer"
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
| A cad_document_records entry linked to the discrepant bom_revisions shows checked_out = true past the effectivity_date on the associated engineering_change_orders | request_more_info | release_engineer | A checked-out CAD document means the released structure the agent is comparing against may not reflect the engineer's latest intended geometry; confirm check-in before treating the ERP BOM as wrong. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
