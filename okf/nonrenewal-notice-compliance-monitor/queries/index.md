---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query policies and policy_quotes from Guidewire PolicyCenter (query_guidewire_policycenter_policies) for records approaching expiration_date or already flagged policy_status = non_renewed, cross-checked against underwriting_submissions to confirm underwriting actually intends non-renewal rather than a routine renewal.](/queries/non-renewal-candidate-identification.md)
- [For each jurisdiction_state and line_of_business on the candidate list, resolve the statutory notice-day window, approved delivery method, and permissible non-renewal reason code by looking up the Non-Renewal Notice Compliance Monitor Authority & Referral Guide (lookup_nonrenewal_notice_compliance_monitor_authority_guide).](/queries/state-deadline-reason-mapping.md)
- [Compare today's candidate list against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to detect if the defective-notice rate or forced-renewal premium exposure is drifting off the tracked baseline, and prioritize the Compliance Officer's daily queue by days-to-deadline.](/queries/deadline-drift-baseline-detection.md)
- [Draft statute-cited non-renewal notice language for each policy and validate every citation anchor against the Authority & Referral Guide before the draft is released to the servicing team, recording supplementary referral notes in the INSURANCE 3 case-tracking records where a manual review was opened.](/queries/notice-drafting-citation-validation.md)
- [Execute action_guidewire_policycenter_publish to finalize the compliant non-renewal notice on the policy record in Guidewire PolicyCenter, publish the daily compliance exception report to BigQuery, and escalate any at-risk deadline to the Compliance Officer with the full audit trail attached.](/queries/publish-audit-trail.md)
