---
type: Query Capability
title: "Auto-create Slack war room channel, page on-call engineers for affected servi..."
description: "Auto-create Slack war room channel, page on-call engineers for affected services, start Zoom bridge, and initialize status page entry. Correlate with recent deployments."
source_id: "war-room-orchestration"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-create Slack war room channel, page on-call engineers for affected services, start Zoom bridge, and initialize status page entry. Correlate with recent deployments.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)

## Runs in

- [war_room_orchestration](/workflow/war-room-orchestration.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Major Incident Coordinator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/major-incident-coordinator-end-to-end.md)

# Citations

- [Major Incident Coordinator Operations Runbook](/documents/major-incident-coordinator-runbook.md)
