---
type: Agent Tool
title: lookup_capability_assessment_agent_policy_guide
description: "Look up sections of the Capability Assessment Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_capability_assessment_agent_policy_guide

Look up sections of the Capability Assessment Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Ariba SLP](/systems/ariba-slp.md)

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

No explicit permission scopes declared; source-system access is tied to [Ariba SLP](/systems/ariba-slp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [response_collection_normalization](/workflow/response-collection-normalization.md)
- [narrative_assessment_recommendation](/workflow/narrative-assessment-recommendation.md)

## Evals

- [Run the Capability Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/capability-assessment-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_capability_assessment_agent_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Ariba SLP](/systems/ariba-slp.md)
