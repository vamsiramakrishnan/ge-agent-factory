---
type: Workflow Stage
title: "Exceedance & Downtime Reconciliation"
description: "Cross-reference emissions_readings flagged exceedance=true against downtime_events and asset_tag_hierarchies from the OSIsoft PI System to attribute the deviation to a specific asset_number and downtime_category rather than reporting a bare number."
source_id: exceedance_downtime_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exceedance & Downtime Reconciliation

Cross-reference emissions_readings flagged exceedance=true against downtime_events and asset_tag_hierarchies from the OSIsoft PI System to attribute the deviation to a specific asset_number and downtime_category rather than reporting a bare number.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_emissions_reporting_agent_sop](/tools/lookup-regulatory-emissions-reporting-agent-sop.md)

Next: [SOP & Rate Manual Evidence Gate](/workflow/sop-rate-manual-evidence-gate.md)
