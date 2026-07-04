---
type: Eval Scenario
title: "The CEMS analyzer on asset #148820 (boiler_stack) last posted a sensor_readin..."
description: "The CEMS analyzer on asset #148820 (boiler_stack) last posted a sensor_reading at 2026-06-30T22:00:00Z, and the OSIsoft PI System shows a downtime_event on the same asset starting 2026-07-01T06:00:00Z for 'breakdown' lasting 640 minutes. BigQuery's cached_aggregates for the June monthly period already report full CO2e coverage for that source. Should June's boiler_stack emissions go into the report as-is?"
source_id: "regulatory-emissions-reporting-agent-stale-cems-evidence-gap"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The CEMS analyzer on asset #148820 (boiler_stack) last posted a sensor_reading at 2026-06-30T22:00:00Z, and the OSIsoft PI System shows a downtime_event on the same asset starting 2026-07-01T06:00:00Z for 'breakdown' lasting 640 minutes. BigQuery's cached_aggregates for the June monthly period already report full CO2e coverage for that source. Should June's boiler_stack emissions go into the report as-is?

## Validates

- [exceedance-downtime-reconciliation](/queries/exceedance-downtime-reconciliation.md)

## Mechanisms to call

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_emissions_reporting_agent_sop](/tools/lookup-regulatory-emissions-reporting-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
