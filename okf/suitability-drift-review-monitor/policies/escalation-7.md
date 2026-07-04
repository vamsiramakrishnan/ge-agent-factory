---
type: Policy
title: Escalation policy 7
description: "When A financial_accounts record has margin_enabled=true and discretionary_managed=true while the linked client_households risk_tolerance is conservative or moderately_conservative; action: escalate_to_human; handoff: supervision_principal"
source_id: "escalation-7"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A financial_accounts record has margin_enabled=true and discretionary_managed=true while the linked client_households risk_tolerance is conservative or moderately_conservative | escalate_to_human | supervision_principal | Discretionary margin trading inside a conservative-tolerance account is a classic suitability red flag; a principal must review before the drift score is finalized. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
