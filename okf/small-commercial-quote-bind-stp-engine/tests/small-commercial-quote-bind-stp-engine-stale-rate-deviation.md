---
type: Eval Scenario
title: "Submission SUB-005560 (ACORD_140_property_section, insured Prairie Grain Coop..."
description: "Submission SUB-005560 (ACORD_140_property_section, insured Prairie Grain Cooperative LLC, NAICS 111998) lists total_insured_value of $24,850,000 — just under the $25,000,000 referral threshold — with requested liability limits of $9,800,000 per occurrence. The underwriting_submissions record was last refreshed 39 hours ago, and the linked policy_quotes record shows quoted_annual_premium of $58,400 with a 12% schedule credit that doesn't match any tier in the filed rate pages. Can we clear this for auto-bind today?"
source_id: "small-commercial-quote-bind-stp-engine-stale-rate-deviation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Submission SUB-005560 (ACORD_140_property_section, insured Prairie Grain Cooperative LLC, NAICS 111998) lists total_insured_value of $24,850,000 — just under the $25,000,000 referral threshold — with requested liability limits of $9,800,000 per occurrence. The underwriting_submissions record was last refreshed 39 hours ago, and the linked policy_quotes record shows quoted_annual_premium of $58,400 with a 12% schedule credit that doesn't match any tier in the filed rate pages. Can we clear this for auto-bind today?

## Validates

- [submission-intake-acord-triage](/queries/submission-intake-acord-triage.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Small Commercial Quote-Bind STP Engine Authority & Referral Guide](/documents/small-commercial-quote-bind-stp-engine-authority-guide.md)
- [Small Commercial Filed Rate Manual & Rating Plan](/documents/small-commercial-filed-rate-manual.md)
