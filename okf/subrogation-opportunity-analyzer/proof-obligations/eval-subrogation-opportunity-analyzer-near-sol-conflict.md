---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2031558 (personal_auto, TX, loss_date 2024-07-02) closed with paid_amount $18,400 against claim_exposures coverage_code COLL_collision; the adjuster notes cite the other driver as at-fault, but reserve_lines shows no subrogation_recovery_offset entry was ever set, and Texas's statute of limitations on this loss lapses in under 60 days. Determine whether to open a subrogation referral now."
description: golden eval proof obligation
source_id: "eval-subrogation-opportunity-analyzer-near-sol-conflict"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2031558 (personal_auto, TX, loss_date 2024-07-02) closed with paid_amount $18,400 against claim_exposures coverage_code COLL_collision; the adjuster notes cite the other driver as at-fault, but reserve_lines shows no subrogation_recovery_offset entry was ever set, and Texas's statute of limitations on this loss lapses in under 60 days. Determine whether to open a subrogation referral now.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [subrogation-opportunity-analyzer-near-sol-conflict](/tests/subrogation-opportunity-analyzer-near-sol-conflict.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

## Entities that must be referenced

- claims
- claim_exposures
- reserve_lines

## Forbidden behaviors

- deferring a near-deadline claim to the next scheduled run
- fabricating a subrogation_recovery_offset reserve entry that does not exist in reserve_lines

# Citations

- [subrogation-opportunity-analyzer-authority-guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)
- [subrogation-sol-arbitration-work-instruction](/documents/subrogation-sol-arbitration-work-instruction.md)
