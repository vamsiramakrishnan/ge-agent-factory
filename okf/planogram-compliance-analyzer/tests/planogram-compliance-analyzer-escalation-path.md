---
type: Eval Scenario
title: While running the Planogram Compliance Analyzer workflow you encounter this c...
description: "While running the Planogram Compliance Analyzer workflow you encounter this condition: Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.. Handle it end to end."
source_id: "planogram-compliance-analyzer-escalation-path"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Planogram Compliance Analyzer workflow you encounter this condition: Forecast override exceeds 30% versus the statistical baseline, or overrides touch more than 10% of SKU-store combinations in a single class-week.. Handle it end to end.

## Validates

- [reset-window-trigger-evidence-intake](/queries/reset-window-trigger-evidence-intake.md)

## Mechanisms to call

- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Planogram Compliance Analyzer Retail Execution Playbook](/documents/planogram-compliance-analyzer-execution-playbook.md)
