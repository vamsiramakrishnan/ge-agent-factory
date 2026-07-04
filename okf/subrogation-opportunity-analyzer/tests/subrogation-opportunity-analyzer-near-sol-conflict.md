---
type: Eval Scenario
title: "Claim CLM-2031558 (personal_auto, TX, loss_date 2024-07-02) closed with paid_..."
description: "Claim CLM-2031558 (personal_auto, TX, loss_date 2024-07-02) closed with paid_amount $18,400 against claim_exposures coverage_code COLL_collision; the adjuster notes cite the other driver as at-fault, but reserve_lines shows no subrogation_recovery_offset entry was ever set, and Texas's statute of limitations on this loss lapses in under 60 days. Determine whether to open a subrogation referral now."
source_id: "subrogation-opportunity-analyzer-near-sol-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2031558 (personal_auto, TX, loss_date 2024-07-02) closed with paid_amount $18,400 against claim_exposures coverage_code COLL_collision; the adjuster notes cite the other driver as at-fault, but reserve_lines shows no subrogation_recovery_offset entry was ever set, and Texas's statute of limitations on this loss lapses in under 60 days. Determine whether to open a subrogation referral now.

## Validates

- [nightly-claim-exposure-intake](/queries/nightly-claim-exposure-intake.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Subrogation Opportunity Analyzer Authority & Referral Guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)
- [Subrogation Statute-of-Limitations & Inter-Company Arbitration Work Instruction](/documents/subrogation-sol-arbitration-work-instruction.md)
