---
type: Eval Scenario
title: While running the Alarm Noise Reduction Engine workflow you encounter this co...
description: "While running the Alarm Noise Reduction Engine workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end."
source_id: "alarm-noise-reduction-engine-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Alarm Noise Reduction Engine workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end.

## Validates

- [alarm-storm-intake-deduplication](/queries/alarm-storm-intake-deduplication.md)

## Mechanisms to call

- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Alarm Noise Reduction Engine Service Assurance Runbook](/documents/alarm-noise-reduction-engine-assurance-runbook.md)
