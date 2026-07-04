---
type: Query Capability
title: "Auto-escalate delayed tasks, send reminders, and deliver daily close status s..."
description: "Auto-escalate delayed tasks, send reminders, and deliver daily close status summary to Controller with predicted completion date."
source_id: "escalation-reporting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Auto-escalate delayed tasks, send reminders, and deliver daily close status summary to Controller with predicted completion date.

## Tools used

- [lookup_close_checklist_orchestrator_controls_playbook](/tools/lookup-close-checklist-orchestrator-controls-playbook.md)
- [action_blackline_escalate](/tools/action-blackline-escalate.md)

## Runs in

- [escalation_reporting](/workflow/escalation-reporting.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

# Citations

- [Close Checklist Orchestrator Controls Playbook](/documents/close-checklist-orchestrator-controls-playbook.md)
