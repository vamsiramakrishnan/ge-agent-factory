---
type: Query Capability
title: Receive major incident declaration from PagerDuty or manual escalation. Class...
description: "Receive major incident declaration from PagerDuty or manual escalation. Classify severity, identify affected services using Datadog service map, and estimate customer impact."
source_id: "incident-detection-classification"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive major incident declaration from PagerDuty or manual escalation. Classify severity, identify affected services using Datadog service map, and estimate customer impact.

## Tools used

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [lookup_major_incident_coordinator_runbook](/tools/lookup-major-incident-coordinator-runbook.md)

## Runs in

- [incident_detection_classification](/workflow/incident-detection-classification.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/major-incident-coordinator-end-to-end.md)

# Citations

- [Major Incident Coordinator Operations Runbook](/documents/major-incident-coordinator-runbook.md)
