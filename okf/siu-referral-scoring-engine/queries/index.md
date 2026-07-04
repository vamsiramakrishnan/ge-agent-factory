---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [On every new claims record or fraud_screening_scores update from FRISS Fraud Detection and Guidewire ClaimCenter, pull the claim's current fraud_score, score_band, and top_indicator alongside claim_status, incurred_amount, and jurisdiction_state so the queue always reflects the freshest signal, not a stale nightly snapshot.](/queries/fnol-fraud-score-intake.md)
- [Cross-reference network_link_indicators (shared providers, body shops, bank accounts, phone numbers) and open siu_referrals history for the claim_number to surface ring exposure, prior_siu_substantiated_hits, and any referral already in active_investigation before a new referral is opened.](/queries/network-link-prior-referral-review.md)
- [Reconcile claim_exposures (coverage_code, exposure_status, demand_amount, attorney_represented) and reserve_lines (transaction_type, authority_level_used, over_authority_referral) in Guidewire ClaimCenter to confirm the claim is still open to indemnity action before any hold is recommended.](/queries/coverage-reserve-cross-check.md)
- [Compare current-period analytics_events against historical_metrics and cached_aggregates in BigQuery to detect drift in SIU referral precision (referrals confirmed) and fraud-detected-before-payment, and to rank the SIU Investigator's queue by expected yield.](/queries/baseline-precision-trend-scoring.md)
- [Cite the SIU Referral Scoring Engine Authority & Referral Guide via lookup_siu_referral_scoring_engine_authority_guide, confirm two-system evidence, then either open/advance the siu_referrals record and call action_friss_fraud_detection_route, or escalate to the SIU Investigator when a gating trigger fires.](/queries/authority-gated-referral-route-decision.md)
