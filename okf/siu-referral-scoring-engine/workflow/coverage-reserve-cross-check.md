---
type: Workflow Stage
title: "Coverage & Reserve Cross-Check"
description: "Reconcile claim_exposures (coverage_code, exposure_status, demand_amount, attorney_represented) and reserve_lines (transaction_type, authority_level_used, over_authority_referral) in Guidewire ClaimCenter to confirm the claim is still open to indemnity action before any hold is recommended."
source_id: coverage_reserve_cross_check
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage & Reserve Cross-Check

Reconcile claim_exposures (coverage_code, exposure_status, demand_amount, attorney_represented) and reserve_lines (transaction_type, authority_level_used, over_authority_referral) in Guidewire ClaimCenter to confirm the claim is still open to indemnity action before any hold is recommended.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)

Next: [Baseline & Precision Trend Scoring](/workflow/baseline-precision-trend-scoring.md)
