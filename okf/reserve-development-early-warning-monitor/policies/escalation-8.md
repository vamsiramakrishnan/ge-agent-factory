---
type: Policy
title: Escalation policy 8
description: "When Model-predicted severity from BigQuery historical_metrics diverges from the posted reserve_amount by more than 40% while the linked claim_exposures record shows attorney_represented true and demand_amount is null or older than the staleness threshold; action: request_more_info; handoff: Handling adjuster of record"
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
| Model-predicted severity from BigQuery historical_metrics diverges from the posted reserve_amount by more than 40% while the linked claim_exposures record shows attorney_represented true and demand_amount is null or older than the staleness threshold | request_more_info | Handling adjuster of record | A large severity gap on a represented claim with no current demand on file cannot be resolved without a fresh attorney-correspondence or demand update; recommending a reserve range on stale exposure data risks under- or over-reserving on a fact pattern the adjuster hasn't yet seen. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
