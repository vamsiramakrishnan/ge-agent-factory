---
type: Agent Tool
title: query_osisoft_pi_system_sensor_readings
description: Retrieve sensor readings from OSIsoft PI System for the Regulatory Emissions Reporting Agent workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_osisoft_pi_system_sensor_readings

Retrieve sensor readings from OSIsoft PI System for the Regulatory Emissions Reporting Agent workflow.

- **Kind:** query
- **Source system:** [OSIsoft PI System](/systems/osisoft-pi-system.md)

## Inputs

- asset_number
- date_range

## Outputs

- sensor_readings_records
- sensor_readings_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [OSIsoft PI System](/systems/osisoft-pi-system.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [continuous_emissions_permit_data_pull](/workflow/continuous-emissions-permit-data-pull.md)
- [exceedance_downtime_reconciliation](/workflow/exceedance-downtime-reconciliation.md)

## Evals

- [Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-emissions-reporting-agent-end-to-end.md)
- [The CEMS analyzer on asset #148820 (boiler_stack) last posted a sensor_reading at 2026-06-30T22:00:00Z, and the OSIsoft PI System shows a downtime_event on the same asset starting 2026-07-01T06:00:00Z for 'breakdown' lasting 640 minutes. BigQuery's cached_aggregates for the June monthly period already report full CO2e coverage for that source. Should June's boiler_stack emissions go into the report as-is?](/tests/regulatory-emissions-reporting-agent-stale-cems-evidence-gap.md)

## Evidence emitted

- sql_result

## Required inputs

- asset_number
- date_range

## Produces

- sensor_readings_records
- sensor_readings_summary

# Examples

```
query_osisoft_pi_system_sensor_readings(asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [OSIsoft PI System](/systems/osisoft-pi-system.md)
