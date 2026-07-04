---
type: Eval Scenario
title: While running the Periodic KYC Review Orchestrator workflow you encounter thi...
description: "While running the Periodic KYC Review Orchestrator workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end."
source_id: "periodic-kyc-review-orchestrator-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Periodic KYC Review Orchestrator workflow you encounter this condition: Cash deposit pattern of three or more transactions between $8,000 and $9,999 across any combination of branches or days within a 7-day window on one relationship. Handle it end to end.

## Validates

- [due-date-cohort-build](/queries/due-date-cohort-build.md)

## Mechanisms to call

- [lookup_periodic_kyc_review_orchestrator_compliance_policy](/tools/lookup-periodic-kyc-review-orchestrator-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Periodic KYC Review Orchestrator Banking Compliance Policy](/documents/periodic-kyc-review-orchestrator-compliance-policy.md)
