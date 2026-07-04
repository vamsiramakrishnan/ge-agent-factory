---
type: Query Capability
title: Publish data quality trending dashboard with improvement tracking. Create Ser...
description: Publish data quality trending dashboard with improvement tracking. Create ServiceNow tickets for corrections requiring human review.
source_id: "quality-dashboard"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Publish data quality trending dashboard with improvement tracking. Create ServiceNow tickets for corrections requiring human review.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_hris_data_quality_monitor_agent_policy_handbook](/tools/lookup-hris-data-quality-monitor-agent-policy-handbook.md)

## Runs in

- [quality_dashboard](/workflow/quality-dashboard.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hris-data-quality-monitor-agent-end-to-end.md)

# Citations

- [HRIS Data Quality Monitor Agent Policy Handbook](/documents/hris-data-quality-monitor-agent-policy-handbook.md)
