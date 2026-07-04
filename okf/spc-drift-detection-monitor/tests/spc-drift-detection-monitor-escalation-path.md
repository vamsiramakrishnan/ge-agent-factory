---
type: Eval Scenario
title: While running the SPC Drift Detection Monitor workflow you encounter this con...
description: "While running the SPC Drift Detection Monitor workflow you encounter this condition: SPC run rule violation — 4 of 5 consecutive points beyond 1 sigma on the same side of center — on a CTQ characteristic. Handle it end to end."
source_id: "spc-drift-detection-monitor-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the SPC Drift Detection Monitor workflow you encounter this condition: SPC run rule violation — 4 of 5 consecutive points beyond 1 sigma on the same side of center — on a CTQ characteristic. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_spc_drift_detection_monitor_sop](/tools/lookup-spc-drift-detection-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SPC Drift Detection Monitor Standard Operating Procedure](/documents/spc-drift-detection-monitor-sop.md)
