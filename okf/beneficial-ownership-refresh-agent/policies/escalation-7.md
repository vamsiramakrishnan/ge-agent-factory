---
type: Policy
title: Escalation policy 7
description: "When A due refresh shows entity_profiles.fincen_boi_verified = false together with beneficial_owner_count = 0 for any entity_type other than individual; action: request_more_info; handoff: KYC Analyst"
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
| A due refresh shows entity_profiles.fincen_boi_verified = false together with beneficial_owner_count = 0 for any entity_type other than individual | request_more_info | KYC Analyst | An unverified BOI status paired with zero recorded owners on a non-individual entity almost always reflects an incomplete prior refresh rather than a true no-owner structure, and must be corrected before the cycle can be closed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
