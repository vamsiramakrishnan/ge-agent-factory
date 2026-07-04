---
type: Proof Obligation
title: "Golden eval obligation — For claim CLM-2044210 (commercial_property, FL), claims.reserve_amount shows $62,000 but the latest reserve_lines transaction (reserve_line_id RL-88231, transaction_type reserve_increase) posted transaction_amount $58,500 under authority_level_used adjuster_25k, and claim_exposures lists demand_amount $210,000 with attorney_represented=true. Reconcile the reserve picture and decide whether this claim can proceed through automated subrogation scoring."
description: golden eval proof obligation
source_id: "eval-subrogation-opportunity-analyzer-reserve-authority-reconciliation"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For claim CLM-2044210 (commercial_property, FL), claims.reserve_amount shows $62,000 but the latest reserve_lines transaction (reserve_line_id RL-88231, transaction_type reserve_increase) posted transaction_amount $58,500 under authority_level_used adjuster_25k, and claim_exposures lists demand_amount $210,000 with attorney_represented=true. Reconcile the reserve picture and decide whether this claim can proceed through automated subrogation scoring.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [subrogation-opportunity-analyzer-reserve-authority-reconciliation](/tests/subrogation-opportunity-analyzer-reserve-authority-reconciliation.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

## Entities that must be referenced

- claims
- claim_exposures
- reserve_lines

## Forbidden behaviors

- auto-generating a subrogation referral for an attorney-represented claim without escalation
- treating the mismatched reserve figures as immaterial

# Citations

- [subrogation-opportunity-analyzer-authority-guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)
