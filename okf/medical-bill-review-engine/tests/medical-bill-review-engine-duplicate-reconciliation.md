---
type: Eval Scenario
title: "Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a U..."
description: "Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a UB-04 billing $18,400 for 22 units of CPT 97110 (therapeutic exercise) on date of service 2026-06-28. The claimant's billing history shows the same CPT code and date of service already billed under the claim's WC_medical exposure for $16,750 three weeks earlier. Reconcile the two submissions, determine whether this is a duplicate, upcoded, or unbundled charge, and recommend pay, reduce, or deny per line."
source_id: "medical-bill-review-engine-duplicate-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a UB-04 billing $18,400 for 22 units of CPT 97110 (therapeutic exercise) on date of service 2026-06-28. The claimant's billing history shows the same CPT code and date of service already billed under the claim's WC_medical exposure for $16,750 three weeks earlier. Reconcile the two submissions, determine whether this is a duplicate, upcoded, or unbundled charge, and recommend pay, reduce, or deny per line.

## Validates

- [bill-intake-line-item-extraction](/queries/bill-intake-line-item-extraction.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Medical Bill Review Fee Schedule & Coding Edits Playbook](/documents/medical-bill-review-engine-fee-schedule-playbook.md)
- [Medical Bill Review Engine Authority & Referral Guide](/documents/medical-bill-review-engine-authority-guide.md)
