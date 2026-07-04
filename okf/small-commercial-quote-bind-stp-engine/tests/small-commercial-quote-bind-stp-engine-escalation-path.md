---
type: Eval Scenario
title: "While running the Small Commercial Quote-Bind STP Engine workflow you encount..."
description: "While running the Small Commercial Quote-Bind STP Engine workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end."
source_id: "small-commercial-quote-bind-stp-engine-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Small Commercial Quote-Bind STP Engine workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_small_commercial_quote_bind_stp_engine_authority_guide](/tools/lookup-small-commercial-quote-bind-stp-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Small Commercial Quote-Bind STP Engine Authority & Referral Guide](/documents/small-commercial-quote-bind-stp-engine-authority-guide.md)
