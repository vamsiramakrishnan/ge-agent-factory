---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull claims, claim_exposures, and reserve_lines from Guidewire ClaimCenter (query_guidewire_claimcenter_claims) and reconcile transaction-level detail into segment-level loss triangles staged in BigQuery.](/queries/loss-triangle-assembly-reconciliation.md)
- [Run chain-ladder and Bornhuggter-Ferguson development methods per line_of_business/jurisdiction_state segment, comparing analytics_events against historical_metrics baselines (query_bigquery_analytics_events) to score variance_pct drift.](/queries/development-method-diagnostics.md)
- [Track reserve_lines transaction_type mix, authority_level_used, and over_authority_referral flags against cached_aggregates baselines to detect case-reserving pattern shifts that distort paid-to-incurred ratios.](/queries/case-reserve-philosophy-drift-check.md)
- [Cite the Reserve Adequacy Analyzer Authority & Referral Guide and the Reserve Data Staleness & Evidence Refresh Runbook (lookup_reserve_adequacy_analyzer_authority_guide) to confirm reserving thresholds, referral triggers, and evidence freshness before any exhibit is drafted.](/queries/authority-evidence-validation.md)
- [Publish segment-level commentary and diagnostic exhibits to Looker dashboards (query_looker_dashboards), highlighting which claims/reserve_lines segments most need actuarial judgment.](/queries/segment-exhibit-drafting-dashboard-publication.md)
- [Execute reserve line updates via action_guidewire_claimcenter_draft with a full audit trail, and escalate adverse-development or authority-referral exceptions to the Actuary or appointed actuary.](/queries/draft-action-escalation-routing.md)
