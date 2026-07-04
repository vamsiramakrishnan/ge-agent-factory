---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull newly reported claims and claim_exposures from Guidewire ClaimCenter (query_guidewire_claimcenter_claims, query_guidewire_claimcenter_claim_exposures) and correlate the notice against its originating Zendesk ticket (query_zendesk_tickets) to capture line_of_business, loss_date, jurisdiction_state, and cat_code at first notice.](/queries/fnol-intake-loss-fact-extraction.md)
- [Confirm coverage_code, exposure_status, attorney_represented, and demand_amount on claim_exposures against the policy's reserve_lines authority_level_used in Guidewire ClaimCenter before any severity scoring begins.](/queries/coverage-exposure-verification.md)
- [Compare incurred_amount, reserve_amount, and cat_code against BigQuery historical_metrics and analytics_events baselines (query_bigquery_analytics_events) to score severity and complexity, flagging stale or missing baseline evidence before it feeds a routing decision.](/queries/severity-complexity-scoring.md)
- [Cite the FNOL Triage & Routing Agent Authority & Referral Guide and the State Adjuster Licensing & CAT Deployment Routing Matrix (lookup_fnol_triage_routing_agent_authority_guide) to confirm reserve authority thresholds, SIU referral criteria, and adjuster licensing before any routing action executes.](/queries/authority-referral-validation.md)
- [Execute the adjuster assignment via action_guidewire_claimcenter_route in Guidewire ClaimCenter, log the audit trail, and notify the claimant through Zendesk tickets and macros (query_zendesk_tickets, query_zendesk_macros) with their adjuster, claim number, and next steps.](/queries/adjuster-assignment-claimant-notification.md)
