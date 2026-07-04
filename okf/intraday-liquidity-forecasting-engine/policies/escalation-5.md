---
type: Policy
title: Escalation policy 5
description: "When Projected LCR falls below the 105% internal buffer (regulatory floor 100%) in any 30-day stress scenario, or overnight funding concentration from a single counterparty exceeds 15% of total wholesale funding; action: escalate_to_human; handoff: alco_chair"
source_id: "escalation-5"
tags:
  - banking
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
| Projected LCR falls below the 105% internal buffer (regulatory floor 100%) in any 30-day stress scenario, or overnight funding concentration from a single counterparty exceeds 15% of total wholesale funding | escalate_to_human | alco_chair | Liquidity buffer erosion and funding concentration are ALCO-owned risks with contingency funding plan triggers; waiting for the regulatory floor eliminates the reaction window the buffer exists to provide. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
