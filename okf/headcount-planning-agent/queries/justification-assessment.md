---
type: Query Capability
title: Gemini interprets hiring justifications and assesses against budget constrain...
description: Gemini interprets hiring justifications and assesses against budget constraints and strategic priorities. Flags misalignment between hiring requests and revenue capacity.
source_id: "justification-assessment"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets hiring justifications and assesses against budget constraints and strategic priorities. Flags misalignment between hiring requests and revenue capacity.

## Tools used

- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)

## Runs in

- [justification_assessment](/workflow/justification-assessment.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Headcount Planning Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/headcount-planning-agent-end-to-end.md)

# Citations

- [Headcount Planning Agent Controls Playbook](/documents/headcount-planning-agent-controls-playbook.md)
