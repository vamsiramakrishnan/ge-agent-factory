---
type: Query Capability
title: "Monitor Workday for recognizable moments — anniversaries, project completions..."
description: "Monitor Workday for recognizable moments — anniversaries, project completions, promotions, and peer nominations. Cross-reference with recognition platform to identify gaps."
source_id: "event-detection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor Workday for recognizable moments — anniversaries, project completions, promotions, and peer nominations. Cross-reference with recognition platform to identify gaps.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_recognition_platform_recognition_platform_records](/tools/query-recognition-platform-recognition-platform-records.md)
- [lookup_recognition_nudge_celebration_policy_handbook](/tools/lookup-recognition-nudge-celebration-policy-handbook.md)

## Runs in

- [event_detection](/workflow/event-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Recognition Nudge & Celebration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/recognition-nudge-celebration-end-to-end.md)

# Citations

- [Recognition Nudge & Celebration Policy Handbook](/documents/recognition-nudge-celebration-policy-handbook.md)
