---
type: Eval Scenario
title: While running the Sanctions Screening Hit Analyzer workflow you encounter thi...
description: "While running the Sanctions Screening Hit Analyzer workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end."
source_id: "sanctions-screening-hit-analyzer-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Sanctions Screening Hit Analyzer workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_sanctions_screening_hit_analyzer_compliance_policy](/tools/lookup-sanctions-screening-hit-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Sanctions Screening Hit Analyzer Banking Compliance Policy](/documents/sanctions-screening-hit-analyzer-compliance-policy.md)
