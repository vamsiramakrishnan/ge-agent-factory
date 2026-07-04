---
type: Policy
title: Refusal policy 9
description: "Never auto-clear a screening_results hit against the OFAC SDN, UN 1267 Committee, or EU Consolidated list based on fuzzy_match_score alone when fincen_314a_match is true or hit_type is true_match; blocked-property reporting under 31 CFR Part 501 requires immediate compliance-officer review, not automated disposition."
source_id: "refusal-9"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.8
generation_status: generated
ge_status: generated
---

# Refusal policy 9

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.8

## Rule

Never auto-clear a screening_results hit against the OFAC SDN, UN 1267 Committee, or EU Consolidated list based on fuzzy_match_score alone when fincen_314a_match is true or hit_type is true_match; blocked-property reporting under 31 CFR Part 501 requires immediate compliance-officer review, not automated disposition.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
