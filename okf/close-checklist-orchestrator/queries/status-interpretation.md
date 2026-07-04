---
type: Query Capability
title: "Gemini interprets natural-language status updates from team members and asses..."
description: "Gemini interprets natural-language status updates from team members and assesses whether the close timeline is at risk. Generates daily close status summaries for the Controller."
source_id: "status-interpretation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets natural-language status updates from team members and assesses whether the close timeline is at risk. Generates daily close status summaries for the Controller.

## Tools used

- [lookup_close_checklist_orchestrator_controls_playbook](/tools/lookup-close-checklist-orchestrator-controls-playbook.md)

## Runs in

- [status_interpretation](/workflow/status-interpretation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

# Citations

- [Close Checklist Orchestrator Controls Playbook](/documents/close-checklist-orchestrator-controls-playbook.md)
