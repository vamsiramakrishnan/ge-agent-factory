---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Screen claims, claim_exposures, and reserve_lines in Guidewire ClaimCenter for new medical bills, attorney correspondence, and status changes (attorney_represented flips, demand_amount postings, pending_coverage_determination shifts) that could move expected ultimate cost.](/queries/reserve-signal-intake.md)
- [Compare each open claim's posted reserve_amount and reserve_lines transaction history against BigQuery historical_metrics and analytics_events variance_pct for the matching line_of_business and jurisdiction_state cohort to compute the model-predicted severity gap.](/queries/severity-benchmarking.md)
- [Cross-check every candidate gap against the Reserve Development Early Warning Monitor Authority & Referral Guide and the Reserve Diary & Stair-Step Prevention Runbook, confirming authority_level_used and over_authority_referral flags on reserve_lines before any recommendation is drafted.](/queries/authority-referral-gate-check.md)
- [Rank flagged claims into the Claims Operations Manager's daily queue using Looker dashboards and metric_definitions, ordered by adverse-development dollars, claim_status, and time since the last reserve_lines transaction.](/queries/gap-scoring-queue-prioritization.md)
- [Execute the file step in Guidewire ClaimCenter to log the suggested reserve range and driving evidence, escalating stair-stepping or over-authority findings to the Claims Operations Manager with a full audit trail.](/queries/manager-escalation-file-action.md)
