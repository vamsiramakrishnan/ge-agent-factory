---
type: Agent Tool
title: lookup_business_review_prep_agent_policy_guide
description: "Look up sections of the Business Review Prep Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_business_review_prep_agent_policy_guide

Look up sections of the Business Review Prep Agent Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google Slides](/systems/google-slides.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Slides](/systems/google-slides.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [qbr_data_assembly](/workflow/qbr-data-assembly.md)
- [trend_visualization_action_tracking](/workflow/trend-visualization-action-tracking.md)
- [narrative_synthesis_counterargument_prep](/workflow/narrative-synthesis-counterargument-prep.md)

## Evals

- [Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/business-review-prep-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_business_review_prep_agent_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Google Slides](/systems/google-slides.md)
