---
type: Agent Tool
title: lookup_knowledge_base_auto_resolver_runbook
description: "Look up sections of the Knowledge Base Auto-Resolver Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_knowledge_base_auto_resolver_runbook

Look up sections of the Knowledge Base Auto-Resolver Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Confluence](/systems/confluence.md)

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

No explicit permission scopes declared; source-system access is tied to [Confluence](/systems/confluence.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [semantic_knowledge_retrieval](/workflow/semantic-knowledge-retrieval.md)
- [contextual_answer_generation](/workflow/contextual-answer-generation.md)
- [resolution_tracking_gap_detection](/workflow/resolution-tracking-gap-detection.md)

## Evals

- [Run the Knowledge Base Auto-Resolver workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/knowledge-base-auto-resolver-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_knowledge_base_auto_resolver_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Confluence](/systems/confluence.md)
