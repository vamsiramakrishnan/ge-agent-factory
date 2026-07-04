---
type: Eval Scenario
title: While running the Medical Bill Review Engine workflow you encounter this cond...
description: "While running the Medical Bill Review Engine workflow you encounter this condition: Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim. Handle it end to end."
source_id: "medical-bill-review-engine-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Medical Bill Review Engine workflow you encounter this condition: Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_medical_bill_review_engine_authority_guide](/tools/lookup-medical-bill-review-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Medical Bill Review Engine Authority & Referral Guide](/documents/medical-bill-review-engine-authority-guide.md)
