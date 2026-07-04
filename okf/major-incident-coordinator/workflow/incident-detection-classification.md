---
type: Workflow Stage
title: "Incident Detection & Classification"
description: "Receive major incident declaration from PagerDuty or manual escalation. Classify severity, identify affected services using Datadog service map, and estimate customer impact."
source_id: incident_detection_classification
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Incident Detection & Classification

Receive major incident declaration from PagerDuty or manual escalation. Classify severity, identify affected services using Datadog service map, and estimate customer impact.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [lookup_major_incident_coordinator_runbook](/tools/lookup-major-incident-coordinator-runbook.md)

Next: [War Room Orchestration](/workflow/war-room-orchestration.md)
