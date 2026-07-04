---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query kyc_cases in Fenergo CLM by next_review_date and cdd_risk_rating to assemble this cycle's periodic-review cohort, sequencing overdue high-risk cases ahead of easy retail cases.](/queries/due-date-cohort-build.md)
- [Pull entity_profiles (expected_monthly_volume, naics_risk_tier, cash_intensive_business) and compare against BigQuery historical_metrics and analytics_events baselines to detect drift from the documented customer profile.](/queries/activity-vs-profile-comparison.md)
- [Auto-complete low-risk kyc_cases with no material change and a documented QA-sampling rationale; route profile mismatches and proposed cdd_risk_rating upgrades to senior analysts through ServiceNow tickets.](/queries/no-change-auto-completion-senior-routing.md)
- [Cite the Periodic KYC Review Orchestrator Banking Compliance Policy before executing action_fenergo_clm_file against the kyc_cases record, emitting a full audit trail for examiner evidence.](/queries/policy-gated-filing-audit.md)
