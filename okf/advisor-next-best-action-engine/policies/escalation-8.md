---
type: Policy
title: Escalation policy 8
description: "When advisory_referrals.suitability_status is determined_unsuitable for a household that still has an open rollover_401k or ira_traditional financial_accounts record with a pending product_interest recommendation; action: refuse; handoff: supervision_principal"
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
| advisory_referrals.suitability_status is determined_unsuitable for a household that still has an open rollover_401k or ira_traditional financial_accounts record with a pending product_interest recommendation | refuse | supervision_principal | Acting on a next-best-action after a documented unsuitability determination directly contradicts the firm's suitability record and creates FINRA Rule 2111 liability. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
