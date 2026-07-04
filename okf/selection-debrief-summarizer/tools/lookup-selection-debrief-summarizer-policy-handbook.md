---
type: Agent Tool
title: lookup_selection_debrief_summarizer_policy_handbook
description: "Look up sections of the Selection Debrief Summarizer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_selection_debrief_summarizer_policy_handbook

Look up sections of the Selection Debrief Summarizer Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google Docs](/systems/google-docs.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Docs](/systems/google-docs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [synthesis_consensus](/workflow/synthesis-consensus.md)
- [documentation_audit](/workflow/documentation-audit.md)

## Evals

- [Run the Selection Debrief Summarizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/selection-debrief-summarizer-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_selection_debrief_summarizer_policy_handbook(section_anchor=<section_anchor>)
```

# Citations

- [Google Docs](/systems/google-docs.md)
