---
type: Agent Tool
title: query_workday_interviewers
description: "Resolve interviewer time zones, office locations, and any 'do not schedule' flags or travel blocks from Workday org data."
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

# query_workday_interviewers

Resolve interviewer time zones, office locations, and any 'do not schedule' flags or travel blocks from Workday org data.

- **Kind:** query
- **Source system:** [Workday](/systems/workday.md)

## Inputs

- interviewer_id_list

## Outputs

- interviewer_profiles
- time_zones
- office_locations
- travel_flags

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

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

- interviewer_id_list

## Produces

- interviewer_profiles
- time_zones
- office_locations
- travel_flags

# Examples

```
query_workday_interviewers(interviewer_id_list=<interviewer_id_list>)
```

# Citations

- [Workday](/systems/workday.md)
