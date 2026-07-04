---
type: Query Capability
title: "Auto-generate milestone celebrations with personalized notes. Deliver via Sla..."
description: "Auto-generate milestone celebrations with personalized notes. Deliver via Slack with team-appropriate tone and visibility."
source_id: "celebration-automation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-generate milestone celebrations with personalized notes. Deliver via Slack with team-appropriate tone and visibility.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_recognition_nudge_celebration_policy_handbook](/tools/lookup-recognition-nudge-celebration-policy-handbook.md)
- [action_slack_generate](/tools/action-slack-generate.md)

## Runs in

- [celebration_automation](/workflow/celebration-automation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-nudge-celebration-end-to-end.md)

# Citations

- [Recognition Nudge & Celebration Policy Handbook](/documents/recognition-nudge-celebration-policy-handbook.md)
