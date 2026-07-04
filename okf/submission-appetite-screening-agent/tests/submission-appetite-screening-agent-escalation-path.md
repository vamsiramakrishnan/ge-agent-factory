---
type: Eval Scenario
title: While running the Submission Appetite Screening Agent workflow you encounter ...
description: "While running the Submission Appetite Screening Agent workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end."
source_id: "submission-appetite-screening-agent-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Submission Appetite Screening Agent workflow you encounter this condition: Submission with total_insured_value greater than $25,000,000 or requested liability limits above $10,000,000 per occurrence. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Submission Appetite Screening Agent Authority & Referral Guide](/documents/submission-appetite-screening-agent-authority-guide.md)
