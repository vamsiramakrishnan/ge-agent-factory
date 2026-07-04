---
type: Eval Scenario
title: Run the Medical Bill Review Engine workflow for the current period. Cite the ...
description: "Run the Medical Bill Review Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "medical-bill-review-engine-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Medical Bill Review Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [bill-intake-line-item-extraction](/queries/bill-intake-line-item-extraction.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)
- [action_guidewire_claimcenter_file](/tools/action-guidewire-claimcenter-file.md)

## Success rubric

Action file executed against Guidewire ClaimCenter, with audit-trail entry and Claims Adjuster notified of outcomes.

# Citations

- [Medical Bill Review Engine Authority & Referral Guide](/documents/medical-bill-review-engine-authority-guide.md)
