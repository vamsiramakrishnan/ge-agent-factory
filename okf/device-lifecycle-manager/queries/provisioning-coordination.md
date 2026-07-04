---
type: Query Capability
title: "Coordinate device provisioning and deprovisioning with HR events (new hires, ..."
description: "Coordinate device provisioning and deprovisioning with HR events (new hires, terminations, role changes). Update inventory and asset tracking."
source_id: "provisioning-coordination"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Coordinate device provisioning and deprovisioning with HR events (new hires, terminations, role changes). Update inventory and asset tracking.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)

## Runs in

- [provisioning_coordination](/workflow/provisioning-coordination.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/device-lifecycle-manager-end-to-end.md)

# Citations

- [Device Lifecycle Manager Operations Runbook](/documents/device-lifecycle-manager-runbook.md)
