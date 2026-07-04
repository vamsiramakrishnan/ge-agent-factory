---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull claim, claim_exposures, and reserve_lines records for the incoming CMS-1500/UB-04 bill from Guidewire ClaimCenter (query_guidewire_claimcenter_claims) to anchor every billed line to the correct claim_number, coverage_code, and injury profile.](/queries/bill-intake-line-item-extraction.md)
- [Validate each CPT/HCPCS line item's units and modifiers against jurisdiction_state fee schedules and NCCI unbundling edits documented in the Fee Schedule & Coding Edits Playbook and the Authority & Referral Guide.](/queries/fee-schedule-coding-validation.md)
- [Cross-check the claimant's full billing history in BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) against the current bill to surface duplicate submissions, upcoded E/M levels, and unbundled procedure pairs.](/queries/duplicate-upcoding-unbundling-detection.md)
- [Confirm the reserve_lines medical reserve_type, transaction_amount, and authority_level_used against escalation thresholds before any pay/reduce/deny recommendation crosses an adjuster's delegated authority.](/queries/authority-reserve-check.md)
- [Draft the per-line pay, reduce, or deny recommendation and the explanation-of-review (EOR) letter, citing the governing sections of the Authority & Referral Guide and Fee Schedule & Coding Edits Playbook (lookup_medical_bill_review_engine_authority_guide).](/queries/pay-reduce-deny-recommendation-eor-drafting.md)
- [Execute action_guidewire_claimcenter_file to record the bill-review outcome in Guidewire ClaimCenter with a full audit trail, and escalate exceptions to the Claims Adjuster.](/queries/file-audit.md)
