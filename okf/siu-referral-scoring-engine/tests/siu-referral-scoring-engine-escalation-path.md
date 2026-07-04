---
type: Eval Scenario
title: While running the SIU Referral Scoring Engine workflow you encounter this con...
description: "While running the SIU Referral Scoring Engine workflow you encounter this condition: Fraud score at or above 700 combined with two or more network link indicators sharing an entity across open claims. Handle it end to end."
source_id: "siu-referral-scoring-engine-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the SIU Referral Scoring Engine workflow you encounter this condition: Fraud score at or above 700 combined with two or more network link indicators sharing an entity across open claims. Handle it end to end.

## Validates

- [fnol-fraud-score-intake](/queries/fnol-fraud-score-intake.md)

## Mechanisms to call

- [lookup_siu_referral_scoring_engine_authority_guide](/tools/lookup-siu-referral-scoring-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SIU Referral Scoring Engine Authority & Referral Guide](/documents/siu-referral-scoring-engine-authority-guide.md)
