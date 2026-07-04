---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query kyc_cases and entity_profiles in Fenergo CLM against next_review_date and profile_last_refreshed to build the current period's beneficial-ownership refresh cohort and prioritize past-due entities.](/queries/refresh-due-date-triage.md)
- [Compare entity_profiles.fincen_boi_verified and beneficial_owner_count against corporate registry data and BigQuery historical_metrics baselines to isolate entities with genuine ownership changes from no-change rollovers.](/queries/registry-fin-cen-boi-cross-check.md)
- [Draft outreach limited to the changed ownership documents and issue DocuSign envelopes and recipients for beneficial-ownership certification forms, tracking receipt through audit_trails.](/queries/targeted-certification-outreach.md)
- [Recompute beneficial_owner_count and 25%-threshold ownership percentages against entity_profiles and screening_results, flagging new PEP exposure or naics_risk_tier changes for the KYC Analyst queue.](/queries/ownership-recalculation-threshold-scoring.md)
- [Cite the Beneficial Ownership Refresh Agent Banking Compliance Policy and the BOI Verification Runbook before executing action_fenergo_clm_file to update the entity_profiles record, escalating high-risk owners first.](/queries/policy-gated-filing.md)
