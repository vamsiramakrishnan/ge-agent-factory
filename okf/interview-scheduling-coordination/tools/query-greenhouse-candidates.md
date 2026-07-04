---
type: Agent Tool
title: query_greenhouse_candidates
description: "Retrieve candidate profile, requisition, and current stage to determine interview timing and panel requirements."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_greenhouse_candidates

Retrieve candidate profile, requisition, and current stage to determine interview timing and panel requirements.

- **Kind:** query
- **Source system:** [Greenhouse](/systems/greenhouse.md)

## Inputs

- candidate_id

## Outputs

- candidate_record
- current_stage
- requisition_id

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Greenhouse](/systems/greenhouse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [panel_availability](/workflow/panel-availability.md)

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)
- [Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.](/tests/timezone-spanning-panel-conflict-resolution.md)
- [Schedule an interview with interviewer INT-001, who has a 'do_not_schedule' flag in Workday. What does the agent do?](/tests/interviewer-conflict-refusal.md)

## Evidence emitted

- source_system_record

## Required inputs

- candidate_id

## Produces

- candidate_record
- current_stage
- requisition_id

# Examples

```
query_greenhouse_candidates(candidate_id=<candidate_id>)
```

# Citations

- [Greenhouse](/systems/greenhouse.md)
