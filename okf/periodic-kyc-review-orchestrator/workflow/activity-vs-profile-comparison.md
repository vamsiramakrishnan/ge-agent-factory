---
type: Workflow Stage
title: "Activity-vs-Profile Comparison"
description: "Pull entity_profiles (expected_monthly_volume, naics_risk_tier, cash_intensive_business) and compare against BigQuery historical_metrics and analytics_events baselines to detect drift from the documented customer profile."
source_id: activity_vs_profile_comparison
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Activity-vs-Profile Comparison

Pull entity_profiles (expected_monthly_volume, naics_risk_tier, cash_intensive_business) and compare against BigQuery historical_metrics and analytics_events baselines to detect drift from the documented customer profile.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)
- [action_fenergo_clm_file](/tools/action-fenergo-clm-file.md)

Next: [No-Change Auto-Completion & Senior Routing](/workflow/no-change-auto-completion-senior-routing.md)
