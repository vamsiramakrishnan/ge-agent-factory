---
type: Eval Scenario
title: "Case 9137204 (profile 1008193, Vantage Point Realty Trust) is up for its peri..."
description: "Case 9137204 (profile 1008193, Vantage Point Realty Trust) is up for its periodic_review. kyc_cases shows cdd_risk_rating='medium' and pep_exposure=false. entity_profiles shows naics_risk_tier='elevated_monitoring', fincen_boi_verified=false, and profile_last_refreshed only 40 days ago. This cycle's screening_results run just returned a new pep_database hit_type='true_match' at fuzzy_match_score 94 with disposition='pending'. The analyst wants to log this as a routine no-change refresh since documents were recently updated. Reconcile and process case 9137204."
source_id: "periodic-kyc-review-orchestrator-pep-hit-vs-recent-refresh"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Case 9137204 (profile 1008193, Vantage Point Realty Trust) is up for its periodic_review. kyc_cases shows cdd_risk_rating='medium' and pep_exposure=false. entity_profiles shows naics_risk_tier='elevated_monitoring', fincen_boi_verified=false, and profile_last_refreshed only 40 days ago. This cycle's screening_results run just returned a new pep_database hit_type='true_match' at fuzzy_match_score 94 with disposition='pending'. The analyst wants to log this as a routine no-change refresh since documents were recently updated. Reconcile and process case 9137204.

## Validates

- [due-date-cohort-build](/queries/due-date-cohort-build.md)

## Mechanisms to call

- [query_fenergo_clm_kyc_cases](/tools/query-fenergo-clm-kyc-cases.md)
- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Periodic KYC Review Orchestrator Banking Compliance Policy](/documents/periodic-kyc-review-orchestrator-compliance-policy.md)
- [Periodic Review Risk-Rating & QA Sampling Work Instruction](/documents/periodic-kyc-review-risk-rating-work-instruction.md)
