---
type: Agent Tool
title: lookup_integration_pattern_advisor_runbook
description: "Look up sections of the Integration Pattern Advisor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_integration_pattern_advisor_runbook

Look up sections of the Integration Pattern Advisor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

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

- [requirements_understanding](/workflow/requirements-understanding.md)
- [pattern_retrieval](/workflow/pattern-retrieval.md)
- [trade_off_analysis](/workflow/trade-off-analysis.md)
- [guidance_delivery](/workflow/guidance-delivery.md)

## Evals

- [Run the Integration Pattern Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/integration-pattern-advisor-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_integration_pattern_advisor_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Confluence](/systems/confluence.md)
