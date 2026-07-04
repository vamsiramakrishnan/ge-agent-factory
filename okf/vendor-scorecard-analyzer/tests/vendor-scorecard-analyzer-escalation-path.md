---
type: Eval Scenario
title: While running the Vendor Performance Scorecard Analyzer workflow you encounte...
description: "While running the Vendor Performance Scorecard Analyzer workflow you encounter this condition: Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.. Handle it end to end."
source_id: "vendor-scorecard-analyzer-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Vendor Performance Scorecard Analyzer workflow you encounter this condition: Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_vendor_scorecard_analyzer_execution_playbook](/tools/lookup-vendor-scorecard-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Vendor Performance Scorecard Analyzer Retail Execution Playbook](/documents/vendor-scorecard-analyzer-execution-playbook.md)
