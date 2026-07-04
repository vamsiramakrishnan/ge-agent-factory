---
type: Workflow Stage
title: Nudge Generation
description: "Gemini generates contextual recognition prompts for managers, personalized with employee context, achievement details, and suggested recognition types based on team norms."
source_id: nudge_generation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Nudge Generation

Gemini generates contextual recognition prompts for managers, personalized with employee context, achievement details, and suggested recognition types based on team norms.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [lookup_recognition_nudge_celebration_policy_handbook](/tools/lookup-recognition-nudge-celebration-policy-handbook.md)
- [action_slack_generate](/tools/action-slack-generate.md)

Next: [Celebration Automation](/workflow/celebration-automation.md)
