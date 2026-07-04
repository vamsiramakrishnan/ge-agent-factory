---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Log the incoming DOI complaint from Zendesk tickets, resolve the policy_number and named_insured against Guidewire PolicyCenter policies, and set the statutory response clock from the jurisdiction_state on the policy.](/queries/doi-complaint-intake-triage.md)
- [Pull policies, policy_quotes, and underwriting_submissions from Guidewire PolicyCenter and correlate them with Zendesk tickets and macros to reconstruct the full correspondence and transaction history behind the complaint.](/queries/customer-file-assembly.md)
- [Call lookup_regulatory_complaint_response_agent_authority_guide to confirm the coverage provisions, referral thresholds, and authority levels that apply before any regulator-facing statement is drafted.](/queries/coverage-authority-verification.md)
- [Query BigQuery analytics_events, historical_metrics, and cached_aggregates to compare the complaint against historical baselines and detect recurring servicing or coverage-interpretation themes.](/queries/root-cause-trend-analysis.md)
- [Draft the factual timeline with citations to the Authority & Referral Guide, track the jurisdiction-specific statutory deadline, and escalate to the Compliance Officer any response at risk of lateness.](/queries/regulator-response-drafting-deadline-tracking.md)
- [Execute action_guidewire_policycenter_publish to file the regulator response with a full audit trail, and push complaint-trend analytics back to BigQuery for root-cause review.](/queries/publish-audit.md)
