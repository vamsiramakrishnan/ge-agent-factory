---
type: Eval Scenario
title: While running the Field Job Closure Quality Analyzer workflow you encounter t...
description: "While running the Field Job Closure Quality Analyzer workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end."
source_id: "field-job-closure-quality-analyzer-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Field Job Closure Quality Analyzer workflow you encounter this condition: Repeat truck roll to the same premise within 30 days of a completed work order (repeat_within_30d flag). Handle it end to end.

## Validates

- [closure-intake-evidence-capture](/queries/closure-intake-evidence-capture.md)

## Mechanisms to call

- [lookup_field_job_closure_quality_analyzer_assurance_runbook](/tools/lookup-field-job-closure-quality-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Field Job Closure Quality Analyzer Service Assurance Runbook](/documents/field-job-closure-quality-analyzer-assurance-runbook.md)
