---
type: Eval Scenario
title: While running the Renewal Risk Requalification Agent workflow you encounter t...
description: "While running the Renewal Risk Requalification Agent workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end."
source_id: "renewal-risk-requalification-agent-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Renewal Risk Requalification Agent workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end.

## Validates

- [renewal-book-selection-90-day-trigger](/queries/renewal-book-selection-90-day-trigger.md)

## Mechanisms to call

- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Renewal Risk Requalification Agent Authority & Referral Guide](/documents/renewal-risk-requalification-agent-authority-guide.md)
