---
type: Eval Scenario
title: While running the Subrogation Opportunity Analyzer workflow you encounter thi...
description: "While running the Subrogation Opportunity Analyzer workflow you encounter this condition: Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim. Handle it end to end."
source_id: "subrogation-opportunity-analyzer-escalation-path"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Subrogation Opportunity Analyzer workflow you encounter this condition: Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Subrogation Opportunity Analyzer Authority & Referral Guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)
