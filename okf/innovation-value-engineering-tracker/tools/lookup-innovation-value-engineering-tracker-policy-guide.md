---
type: Agent Tool
title: lookup_innovation_value_engineering_tracker_policy_guide
description: "Look up sections of the Innovation & Value Engineering Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_innovation_value_engineering_tracker_policy_guide

Look up sections of the Innovation & Value Engineering Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Supplier Portal](/systems/supplier-portal.md)

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

No explicit permission scopes declared; source-system access is tied to [Supplier Portal](/systems/supplier-portal.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [proposal_intake_triage](/workflow/proposal-intake-triage.md)
- [feasibility_reasoning_value_assessment](/workflow/feasibility-reasoning-value-assessment.md)

## Evals

- [Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/innovation-value-engineering-tracker-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_innovation_value_engineering_tracker_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Supplier Portal](/systems/supplier-portal.md)
