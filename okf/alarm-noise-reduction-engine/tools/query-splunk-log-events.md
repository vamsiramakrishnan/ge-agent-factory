---
type: Agent Tool
title: query_splunk_log_events
description: Retrieve log events from Splunk for the Alarm Noise Reduction Engine workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_splunk_log_events

Retrieve log events from Splunk for the Alarm Noise Reduction Engine workflow.

- **Kind:** query
- **Source system:** [Splunk](/systems/splunk.md)

## Inputs

- lookup_key
- date_range

## Outputs

- log_events_records
- log_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Splunk](/systems/splunk.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alarm_storm_intake_deduplication](/workflow/alarm-storm-intake-deduplication.md)
- [topology_timing_correlation](/workflow/topology-timing-correlation.md)
- [baseline_deviation_severity_scoring](/workflow/baseline-deviation-severity-scoring.md)

## Evals

- [Run the Alarm Noise Reduction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/alarm-noise-reduction-engine-end-to-end.md)
- [Alarm 812345678 on ne_id 214883 at site 14502 still shows clear_status=active in Ericsson Network Manager, but the linked alert_actions ticket for that alarm was marked status=resolved with sla_met=true two hours ago. The site's battery_runtime_hours reads 3.2 and backhaul_type is microwave. Close out alarm 812345678 as resolved and route it to the domain team.](/tests/alarm-noise-reduction-engine-ticket-state-conflict.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- log_events_records
- log_events_summary

# Examples

```
query_splunk_log_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Splunk](/systems/splunk.md)
