---
type: Query Capability
title: Map each regulatory change to existing controls in ServiceNow GRC. Identify w...
description: Map each regulatory change to existing controls in ServiceNow GRC. Identify which current policies and procedures are affected. Flag gaps where no existing control addresses the new requirement.
source_id: "control-mapping"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Map each regulatory change to existing controls in ServiceNow GRC. Identify which current policies and procedures are affected. Flag gaps where no existing control addresses the new requirement.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [lookup_regulatory_change_monitor_runbook](/tools/lookup-regulatory-change-monitor-runbook.md)

## Runs in

- [control_mapping](/workflow/control-mapping.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

# Citations

- [Regulatory Change Monitor Operations Runbook](/documents/regulatory-change-monitor-runbook.md)
