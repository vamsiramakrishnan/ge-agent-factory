---
type: Agent Tool
title: lookup_intelligent_ticket_router_runbook
description: "Look up sections of the Intelligent Ticket Router Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_intelligent_ticket_router_runbook

Look up sections of the Intelligent Ticket Router Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [ServiceNow](/systems/servicenow.md)

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

No explicit permission scopes declared; source-system access is tied to [ServiceNow](/systems/servicenow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_channel_intake](/workflow/multi-channel-intake.md)
- [nlp_classification_priority](/workflow/nlp-classification-priority.md)
- [intelligent_routing](/workflow/intelligent-routing.md)
- [feedback_learning](/workflow/feedback-learning.md)

## Evals

- [Run the Intelligent Ticket Router workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intelligent-ticket-router-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_intelligent_ticket_router_runbook(section_anchor=<section_anchor>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)
