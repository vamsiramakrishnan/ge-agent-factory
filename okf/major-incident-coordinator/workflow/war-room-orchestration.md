---
type: Workflow Stage
title: War Room Orchestration
description: "Auto-create Slack war room channel, page on-call engineers for affected services, start Zoom bridge, and initialize status page entry. Correlate with recent deployments."
source_id: war_room_orchestration
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# War Room Orchestration

Auto-create Slack war room channel, page on-call engineers for affected services, start Zoom bridge, and initialize status page entry. Correlate with recent deployments.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_zoom_zoom_records](/tools/query-zoom-zoom-records.md)

Next: [Impact & Communication Management](/workflow/impact-communication-management.md)
