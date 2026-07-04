---
type: Policy
title: Escalation policy 8
description: "When A financial_accounts record with registration_type of revocable_trust or ugma_utma is paired with an advisory_referrals suitability_status other than principal_approved; action: request_more_info; handoff: new_accounts_supervision_desk"
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
| A financial_accounts record with registration_type of revocable_trust or ugma_utma is paired with an advisory_referrals suitability_status other than principal_approved | request_more_info | new_accounts_supervision_desk | Trust and minor-registered accounts carry fiduciary and capacity documentation requirements beyond the standard suitability profile; publishing a funded status before principal sign-off risks an unauthorized account opening. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
