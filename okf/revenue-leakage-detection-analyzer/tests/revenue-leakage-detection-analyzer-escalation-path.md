---
type: Eval Scenario
title: While running the Revenue Leakage Detection Analyzer workflow you encounter t...
description: "While running the Revenue Leakage Detection Analyzer workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end."
source_id: "revenue-leakage-detection-analyzer-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Revenue Leakage Detection Analyzer workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Revenue Leakage Detection Analyzer Service Assurance Runbook](/documents/revenue-leakage-detection-analyzer-assurance-runbook.md)
