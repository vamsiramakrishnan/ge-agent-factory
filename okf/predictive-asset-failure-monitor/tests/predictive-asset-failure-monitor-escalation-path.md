---
type: Eval Scenario
title: While running the Predictive Asset Failure Monitor workflow you encounter thi...
description: "While running the Predictive Asset Failure Monitor workflow you encounter this condition: Vibration velocity reading enters ISO 10816/20816 zone D on an asset with criticality_ranking a_constraint. Handle it end to end."
source_id: "predictive-asset-failure-monitor-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Predictive Asset Failure Monitor workflow you encounter this condition: Vibration velocity reading enters ISO 10816/20816 zone D on an asset with criticality_ranking a_constraint. Handle it end to end.

## Validates

- [condition-signal-intake](/queries/condition-signal-intake.md)

## Mechanisms to call

- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Predictive Asset Failure Monitor Standard Operating Procedure](/documents/predictive-asset-failure-monitor-sop.md)
