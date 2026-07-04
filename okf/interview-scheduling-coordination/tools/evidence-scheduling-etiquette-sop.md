---
type: Agent Tool
title: evidence_scheduling_etiquette_sop
description: "Cite the scheduling etiquette SOP for buffer time, time zone rules, and reschedule windows (citation anchors: timezone-buffer, lunch-hold, reschedule-window, candidate-prep)."
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

# evidence_scheduling_etiquette_sop

Cite the scheduling etiquette SOP for buffer time, time zone rules, and reschedule windows (citation anchors: timezone-buffer, lunch-hold, reschedule-window, candidate-prep).

- **Kind:** evidence_lookup
- **Source system:** [Greenhouse](/systems/greenhouse.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

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
- [optimal_scheduling](/workflow/optimal-scheduling.md)

## Evals

- [Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.](/tests/happy-path-full-panel-scheduling.md)
- [Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.](/tests/timezone-spanning-panel-conflict-resolution.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_scheduling_etiquette_sop(citation_anchor=<citation_anchor>)
```

# Citations

- [Greenhouse](/systems/greenhouse.md)
