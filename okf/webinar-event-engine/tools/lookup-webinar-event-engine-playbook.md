---
type: Agent Tool
title: lookup_webinar_event_engine_playbook
description: "Look up sections of the Webinar & Event Engine Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_webinar_event_engine_playbook

Look up sections of the Webinar & Event Engine Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Zoom](/systems/zoom.md)

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

No explicit permission scopes declared; source-system access is tied to [Zoom](/systems/zoom.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [event_configuration](/workflow/event-configuration.md)
- [content_follow_up_generation](/workflow/content-follow-up-generation.md)
- [post_event_orchestration](/workflow/post-event-orchestration.md)

## Evals

- [Run the Webinar & Event Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/webinar-event-engine-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_webinar_event_engine_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Zoom](/systems/zoom.md)
