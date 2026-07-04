---
type: Query Capability
title: "Gemini analyzes utilization data and recommends reconfigurations: 'The 20-per..."
description: "Gemini analyzes utilization data and recommends reconfigurations: 'The 20-person boardroom averages 6 attendees — convert into 2 huddle rooms. The 3rd floor has zero bookings after 3PM — make it an open workspace.'"
source_id: "optimization-recommendations"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes utilization data and recommends reconfigurations: 'The 20-person boardroom averages 6 attendees — convert into 2 huddle rooms. The 3rd floor has zero bookings after 3PM — make it an open workspace.'

## Tools used

- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_meeting_room_resource_optimizer_runbook](/tools/lookup-meeting-room-resource-optimizer-runbook.md)
- [action_google_calendar_recommend](/tools/action-google-calendar-recommend.md)

## Runs in

- [optimization_recommendations](/workflow/optimization-recommendations.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Meeting Room & Resource Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/meeting-room-resource-optimizer-end-to-end.md)

# Citations

- [Meeting Room & Resource Optimizer Operations Runbook](/documents/meeting-room-resource-optimizer-runbook.md)
