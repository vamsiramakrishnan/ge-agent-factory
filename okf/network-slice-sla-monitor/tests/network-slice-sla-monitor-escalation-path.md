---
type: Eval Scenario
title: While running the 5G Network Slice SLA Monitor workflow you encounter this co...
description: "While running the 5G Network Slice SLA Monitor workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end."
source_id: "network-slice-sla-monitor-escalation-path"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the 5G Network Slice SLA Monitor workflow you encounter this condition: Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_network_slice_sla_monitor_assurance_runbook](/tools/lookup-network-slice-sla-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [5G Network Slice SLA Monitor Service Assurance Runbook](/documents/network-slice-sla-monitor-assurance-runbook.md)
