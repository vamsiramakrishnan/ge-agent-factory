---
type: Eval Scenario
title: "For claim CLM-2044210 (commercial_property, FL), claims.reserve_amount shows ..."
description: "For claim CLM-2044210 (commercial_property, FL), claims.reserve_amount shows $62,000 but the latest reserve_lines transaction (reserve_line_id RL-88231, transaction_type reserve_increase) posted transaction_amount $58,500 under authority_level_used adjuster_25k, and claim_exposures lists demand_amount $210,000 with attorney_represented=true. Reconcile the reserve picture and decide whether this claim can proceed through automated subrogation scoring."
source_id: "subrogation-opportunity-analyzer-reserve-authority-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For claim CLM-2044210 (commercial_property, FL), claims.reserve_amount shows $62,000 but the latest reserve_lines transaction (reserve_line_id RL-88231, transaction_type reserve_increase) posted transaction_amount $58,500 under authority_level_used adjuster_25k, and claim_exposures lists demand_amount $210,000 with attorney_represented=true. Reconcile the reserve picture and decide whether this claim can proceed through automated subrogation scoring.

## Validates

- [nightly-claim-exposure-intake](/queries/nightly-claim-exposure-intake.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Subrogation Opportunity Analyzer Authority & Referral Guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)
