---
type: Agent Tool
title: lookup_community_engagement_responder_playbook
description: "Look up sections of the Community Engagement Responder Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_community_engagement_responder_playbook

Look up sections of the Community Engagement Responder Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Sprout Social](/systems/sprout-social.md)

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

No explicit permission scopes declared; source-system access is tied to [Sprout Social](/systems/sprout-social.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [mention_intake_classification](/workflow/mention-intake-classification.md)
- [contextual_response_generation](/workflow/contextual-response-generation.md)
- [publishing_escalation](/workflow/publishing-escalation.md)

## Evals

- [Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/community-engagement-responder-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_community_engagement_responder_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Sprout Social](/systems/sprout-social.md)
