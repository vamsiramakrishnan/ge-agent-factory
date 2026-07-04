---
type: Eval Scenario
title: While running the ACH Return Root Cause Analyzer workflow you encounter this ...
description: "While running the ACH Return Root Cause Analyzer workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end."
source_id: "ach-return-root-cause-analyzer-escalation-path"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the ACH Return Root Cause Analyzer workflow you encounter this condition: Outbound wire of $250,000 or more to a first-time beneficiary, or any wire where payment instructions were changed via email or inbound phone call (business email compromise indicators). Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [ACH Return Root Cause Analyzer Banking Compliance Policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
