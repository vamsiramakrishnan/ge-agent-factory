---
type: Eval Scenario
title: "Run the Recognition Nudge & Celebration workflow for the current period. Cite..."
description: "Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "recognition-nudge-celebration-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [celebration-automation](/queries/celebration-automation.md)

## Mechanisms to call

- [query_slack_messages](/tools/query-slack-messages.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [lookup_recognition_nudge_celebration_policy_handbook](/tools/lookup-recognition-nudge-celebration-policy-handbook.md)
- [action_slack_generate](/tools/action-slack-generate.md)

## Success rubric

Action generate executed against Slack, with audit-trail entry and Manager notified of outcomes.

# Citations

- [Recognition Nudge & Celebration Policy Handbook](/documents/recognition-nudge-celebration-policy-handbook.md)
