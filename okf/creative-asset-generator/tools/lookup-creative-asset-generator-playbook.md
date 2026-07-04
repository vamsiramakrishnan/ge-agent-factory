---
type: Agent Tool
title: lookup_creative_asset_generator_playbook
description: "Look up sections of the Creative Asset Generator Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_creative_asset_generator_playbook

Look up sections of the Creative Asset Generator Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Figma](/systems/figma.md)

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

No explicit permission scopes declared; source-system access is tied to [Figma](/systems/figma.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [request_processing](/workflow/request-processing.md)
- [performance_analysis](/workflow/performance-analysis.md)
- [approval_publishing](/workflow/approval-publishing.md)

## Evals

- [Run the Creative Asset Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/creative-asset-generator-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_creative_asset_generator_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Figma](/systems/figma.md)
