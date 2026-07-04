---
type: Policy
title: Escalation policy 6
description: "When In-transit inventory variance or carrier claim exposure exceeds $50k on a single lane or load.; action: request_more_info; handoff: transportation_claims_analyst"
source_id: "escalation-6"
tags:
  - retail
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
| In-transit inventory variance or carrier claim exposure exceeds $50k on a single lane or load. | request_more_info | transportation_claims_analyst | High-value discrepancies need seal records, BOL reconciliation, and carrier statements before any write-off or reroute is committed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
