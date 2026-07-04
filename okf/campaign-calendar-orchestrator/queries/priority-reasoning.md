---
type: Query Capability
title: "When campaigns target overlapping audiences in the same week, Gemini reasons ..."
description: "When campaigns target overlapping audiences in the same week, Gemini reasons about which should take priority based on funnel stage, deal size potential, and response fatigue. Generates weekly narrative summaries."
source_id: "priority-reasoning"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# When campaigns target overlapping audiences in the same week, Gemini reasons about which should take priority based on funnel stage, deal size potential, and response fatigue. Generates weekly narrative summaries.

## Tools used

- [lookup_campaign_calendar_orchestrator_playbook](/tools/lookup-campaign-calendar-orchestrator-playbook.md)

## Runs in

- [priority_reasoning](/workflow/priority-reasoning.md)

## Evidence expected

- document_reference

## Evals

- [Run the Campaign Calendar Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/campaign-calendar-orchestrator-end-to-end.md)

# Citations

- [Campaign Calendar Orchestrator Playbook](/documents/campaign-calendar-orchestrator-playbook.md)
