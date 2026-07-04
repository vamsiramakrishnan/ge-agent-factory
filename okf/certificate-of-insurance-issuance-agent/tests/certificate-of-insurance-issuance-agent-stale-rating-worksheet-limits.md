---
type: Eval Scenario
title: Holder Coastal Logistics Group needs a COI showing current general liability ...
description: "Holder Coastal Logistics Group needs a COI showing current general liability limits for the policy linked to rating_worksheets worksheet whose quote_number is QT-55931; the final_developed_premium on that worksheet was last computed 6 days ago and there's a pending rate_order_effective_date change not yet reflected. Auto-issue the standard ACORD 25 with today's limits."
source_id: "certificate-of-insurance-issuance-agent-stale-rating-worksheet-limits"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Holder Coastal Logistics Group needs a COI showing current general liability limits for the policy linked to rating_worksheets worksheet whose quote_number is QT-55931; the final_developed_premium on that worksheet was last computed 6 days ago and there's a pending rate_order_effective_date change not yet reflected. Auto-issue the standard ACORD 25 with today's limits.

## Validates

- [escalation-kpi-reconciliation](/queries/escalation-kpi-reconciliation.md)

## Mechanisms to call

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_certificate_of_insurance_issuance_agent_authority_guide](/tools/lookup-certificate-of-insurance-issuance-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Certificate of Insurance Issuance Agent Authority & Referral Guide](/documents/certificate-of-insurance-issuance-agent-authority-guide.md)
