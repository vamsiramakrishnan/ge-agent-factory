---
type: Query Capability
title: "Gemini generates personalized talking points, coaching prompts, and recogniti..."
description: "Gemini generates personalized talking points, coaching prompts, and recognition reminders based on assembled context and recent developments."
source_id: "agenda-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates personalized talking points, coaching prompts, and recognition reminders based on assembled context and recent developments.

## Tools used

- [action_google_calendar_generate](/tools/action-google-calendar-generate.md)

## Runs in

- [agenda_generation](/workflow/agenda-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the 1:1 Meeting Prep workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/1-1-meeting-prep-end-to-end.md)

# Citations

- [1:1 Meeting Prep Policy Handbook](/documents/1-1-meeting-prep-policy-handbook.md)
