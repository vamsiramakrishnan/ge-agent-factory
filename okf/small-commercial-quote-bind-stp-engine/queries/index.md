---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest new business submissions from Guidewire PolicyCenter's underwriting_submissions table, validating ACORD_125_commercial_app, ACORD_126_gl_section, ACORD_130_workers_comp, and ACORD_140_property_section forms plus NAICS code and producing broker appointment status before the risk enters the quote queue.](/queries/submission-intake-acord-triage.md)
- [Check policy_quotes and underwriting_submissions total_insured_value, jurisdiction_state, and OFAC sanctions screening results to confirm the account sits inside small commercial BOP and workers' comp appetite before rating proceeds in Guidewire PolicyCenter.](/queries/eligibility-appetite-screening.md)
- [Score each policy_quotes record's underwriting_tier against historical_metrics and analytics_events in BigQuery to determine whether the risk clears for straight-through processing or must be queued for underwriter referral.](/queries/automated-risk-scoring-stp-eligibility.md)
- [Cross-check every STP-eligible quote against the Small Commercial Quote-Bind STP Engine Authority & Referral Guide via lookup_small_commercial_quote_bind_stp_engine_authority_guide, citing the authority-level and threshold sections before clearing the record for bind.](/queries/authority-referral-gate-check.md)
- [Execute action_guidewire_policycenter_publish to convert a cleared policy_quotes record into a bound policies record in Guidewire PolicyCenter, writing a generated_audit_trail entry for the underwriting file.](/queries/bind-policy-issuance.md)
- [Publish straight-through processing rate, referral-reason, and quote-to-bind conversion figures to Looker dashboards and metric_definitions so the Underwriting Manager can retune referral thresholds weekly.](/queries/stp-performance-threshold-tuning.md)
