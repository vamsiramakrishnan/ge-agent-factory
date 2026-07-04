---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query policies nearing expiration_date (policy_status in_force) from Guidewire PolicyCenter via query_guidewire_policycenter_policies, and cross-reference open policy_quotes and underwriting_submissions for the same named_insured so an account with new business already in flight isn't requalified out of sequence.](/queries/renewal-book-selection-90-day-trigger.md)
- [Pull current risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions (query_lexisnexis_risk_solutions_risk_reports) to refresh hazard_grade, worst_violation_36mo, and prior_losses_found against what was on file at the account's last renewal.](/queries/exposure-loss-signal-refresh.md)
- [Compare refreshed exposures and claims activity against historical_metrics and cached_aggregates in BigQuery (query_bigquery_analytics_events), computing variance_pct to flag accounts that have drifted from their expiring terms and to prioritize the requalification queue.](/queries/risk-delta-scoring-baseline-comparison.md)
- [Recommend renew-as-is, re-rate, or non-renew treatment per policies account, then cite the Renewal Risk Requalification Agent Authority & Referral Guide (lookup_renewal_risk_requalification_agent_authority_guide) to confirm referral thresholds and non-renewal notice-timing constraints are satisfied before any recommendation is finalized.](/queries/treatment-recommendation-authority-validation.md)
- [Execute action_guidewire_policycenter_route to move only changed-risk accounts into the underwriter queue with drafted renewal terms and broker talking points, emitting a full audit trail in Guidewire PolicyCenter for every routed decision.](/queries/route-audit-to-underwriter-queue.md)
