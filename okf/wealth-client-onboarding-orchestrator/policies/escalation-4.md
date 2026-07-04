---
type: Policy
title: Escalation policy 4
description: "When Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household; action: escalate_to_human; handoff: supervision_principal"
source_id: "escalation-4"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Proposed transaction would push a single-issuer position above 20% of household managed assets, or a structured note/alternative allocation above 10% for a non-accredited household | escalate_to_human | supervision_principal | Concentration beyond policy bands requires principal review against the client's documented objective and liquidity needs; concentrated unsuitable positions are a recurring FINRA enforcement theme. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
