---
type: Eval Scenario
title: Run the Regulatory Emissions Reporting Agent workflow for the current period....
description: "Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "regulatory-emissions-reporting-agent-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [continuous-emissions-permit-data-pull](/queries/continuous-emissions-permit-data-pull.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_osisoft_pi_system_sensor_readings](/tools/query-osisoft-pi-system-sensor-readings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_regulatory_emissions_reporting_agent_sop](/tools/lookup-regulatory-emissions-reporting-agent-sop.md)
- [action_sphera_ehs_draft](/tools/action-sphera-ehs-draft.md)

## Success rubric

Action draft executed against Sphera EHS, with audit-trail entry and Environmental Compliance Specialist notified of outcomes.

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
