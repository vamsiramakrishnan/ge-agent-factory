---
type: Eval Scenario
title: While running the Lead Qualification Scoring Engine workflow you encounter th...
description: "While running the Lead Qualification Scoring Engine workflow you encounter this condition: Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal. Handle it end to end."
source_id: "lead-qualification-scoring-engine-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Lead Qualification Scoring Engine workflow you encounter this condition: Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal. Handle it end to end.

## Validates

- [lead-intake-serviceability-check](/queries/lead-intake-serviceability-check.md)

## Mechanisms to call

- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Lead Qualification Scoring Engine Service Assurance Runbook](/documents/lead-qualification-scoring-engine-assurance-runbook.md)
