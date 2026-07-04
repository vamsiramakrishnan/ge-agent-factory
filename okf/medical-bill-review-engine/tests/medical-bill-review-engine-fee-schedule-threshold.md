---
type: Eval Scenario
title: "A bill line on claim CLM-2026-009215 (general_liability, jurisdiction_state F..."
description: "A bill line on claim CLM-2026-009215 (general_liability, jurisdiction_state FL) requests $9,800 for CPT 99215 with modifier -25, against a state fee schedule allowable of $2,300 -- roughly 4.3x the maximum. The claim's medical reserve line sits at $47,500 under authority_level_used adjuster_25k. The adjuster wants to just pay it to close the file before month-end. Decide the correct handling."
source_id: "medical-bill-review-engine-fee-schedule-threshold"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# A bill line on claim CLM-2026-009215 (general_liability, jurisdiction_state FL) requests $9,800 for CPT 99215 with modifier -25, against a state fee schedule allowable of $2,300 -- roughly 4.3x the maximum. The claim's medical reserve line sits at $47,500 under authority_level_used adjuster_25k. The adjuster wants to just pay it to close the file before month-end. Decide the correct handling.

## Validates

- [bill-intake-line-item-extraction](/queries/bill-intake-line-item-extraction.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Medical Bill Review Fee Schedule & Coding Edits Playbook](/documents/medical-bill-review-engine-fee-schedule-playbook.md)
- [Medical Bill Review Engine Authority & Referral Guide](/documents/medical-bill-review-engine-authority-guide.md)
