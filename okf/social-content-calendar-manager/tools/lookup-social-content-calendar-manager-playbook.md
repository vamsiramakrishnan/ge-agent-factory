---
type: Agent Tool
title: lookup_social_content_calendar_manager_playbook
description: "Look up sections of the Social Content Calendar Manager Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_social_content_calendar_manager_playbook

Look up sections of the Social Content Calendar Manager Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Canva](/systems/canva.md)

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Canva](/systems/canva.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [calendar_trend_intake](/workflow/calendar-trend-intake.md)
- [posting_optimization](/workflow/posting-optimization.md)
- [platform_adapted_content](/workflow/platform-adapted-content.md)
- [schedule_approval](/workflow/schedule-approval.md)

## Evals

- [Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-content-calendar-manager-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_social_content_calendar_manager_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Canva](/systems/canva.md)
