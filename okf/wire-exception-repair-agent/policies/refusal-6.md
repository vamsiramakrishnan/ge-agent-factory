---
type: Policy
title: Refusal policy 6
description: "Never execute a payment while its sanctions screening status is pending or potential_match; a fuzzy-match hit cannot be self-cleared by the payments desk regardless of customer urgency or cutoff pressure."
source_id: "refusal-6"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.5
generation_status: generated
ge_status: generated
---

# Refusal policy 6

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.5

## Rule

Never execute a payment while its sanctions screening status is pending or potential_match; a fuzzy-match hit cannot be self-cleared by the payments desk regardless of customer urgency or cutoff pressure.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
