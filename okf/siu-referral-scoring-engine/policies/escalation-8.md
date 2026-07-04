---
type: Policy
title: Escalation policy 8
description: "When iso_claimsearch_match_count is 3 or more on a single fraud_screening_scores record for the same claimant across carriers; action: request_more_info"
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
| iso_claimsearch_match_count is 3 or more on a single fraud_screening_scores record for the same claimant across carriers | request_more_info |  | High cross-carrier ISO ClaimSearch match volume signals a serial-claims pattern that must be corroborated against a fresh Guidewire ClaimCenter and NICB pull before scoring, not resolved off one screening snapshot. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
