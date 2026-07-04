---
type: Policy
title: Refusal policy 9
description: "Never auto-complete a periodic review as 'no material change' when entity_profiles.expected_monthly_volume deviates from the BigQuery historical_metrics baseline beyond the work-instruction threshold, or when cdd_risk_rating is high or prohibited; those cases require senior-analyst sign-off before action_fenergo_clm_file fires, per the Periodic Review Risk-Rating & QA Sampling Work Instruction."
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

Never auto-complete a periodic review as 'no material change' when entity_profiles.expected_monthly_volume deviates from the BigQuery historical_metrics baseline beyond the work-instruction threshold, or when cdd_risk_rating is high or prohibited; those cases require senior-analyst sign-off before action_fenergo_clm_file fires, per the Periodic Review Risk-Rating & QA Sampling Work Instruction.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
