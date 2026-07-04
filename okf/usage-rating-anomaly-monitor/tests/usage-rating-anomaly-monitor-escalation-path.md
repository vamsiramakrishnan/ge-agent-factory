---
type: Eval Scenario
title: While running the Usage Rating Anomaly Monitor workflow you encounter this co...
description: "While running the Usage Rating Anomaly Monitor workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end."
source_id: "usage-rating-anomaly-monitor-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Usage Rating Anomaly Monitor workflow you encounter this condition: Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle. Handle it end to end.

## Validates

- [catalog-change-baseline-watch](/queries/catalog-change-baseline-watch.md)

## Mechanisms to call

- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Usage Rating Anomaly Monitor Service Assurance Runbook](/documents/usage-rating-anomaly-monitor-assurance-runbook.md)
