---
type: Query Capability
title: "Gemini generates contextual recognition prompts for managers, personalized wi..."
description: "Gemini generates contextual recognition prompts for managers, personalized with employee context, achievement details, and suggested recognition types based on team norms."
source_id: "nudge-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates contextual recognition prompts for managers, personalized with employee context, achievement details, and suggested recognition types based on team norms.

## Tools used

- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [lookup_recognition_nudge_celebration_policy_handbook](/tools/lookup-recognition-nudge-celebration-policy-handbook.md)
- [action_slack_generate](/tools/action-slack-generate.md)

## Runs in

- [nudge_generation](/workflow/nudge-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-nudge-celebration-end-to-end.md)

# Citations

- [Recognition Nudge & Celebration Policy Handbook](/documents/recognition-nudge-celebration-policy-handbook.md)
