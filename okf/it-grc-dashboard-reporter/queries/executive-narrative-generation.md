---
type: Query Capability
title: "Gemini generates a board-ready GRC summary — highlighting key improvements, r..."
description: "Gemini generates a board-ready GRC summary — highlighting key improvements, remaining gaps, and recommended actions. Explains compliance score changes with specific causal factors."
source_id: "executive-narrative-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates a board-ready GRC summary — highlighting key improvements, remaining gaps, and recommended actions. Explains compliance score changes with specific causal factors.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Runs in

- [executive_narrative_generation](/workflow/executive-narrative-generation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the IT GRC Dashboard & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-grc-dashboard-reporter-end-to-end.md)

# Citations

- [IT GRC Dashboard & Reporter Operations Runbook](/documents/it-grc-dashboard-reporter-runbook.md)
