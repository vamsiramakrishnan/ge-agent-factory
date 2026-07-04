---
type: Agent Tool
title: lookup_requisition_intake_validation_policy_handbook
description: "Look up sections of the Requisition Intake & Validation Policy Handbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_requisition_intake_validation_policy_handbook

Look up sections of the Requisition Intake & Validation Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Workday](/systems/workday.md)

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

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [intake_validation](/workflow/intake-validation.md)
- [enrichment_scoring](/workflow/enrichment-scoring.md)
- [routing_approval](/workflow/routing-approval.md)

## Evals

- [Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-validation-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_requisition_intake_validation_policy_handbook(section_anchor=<section_anchor>)
```

# Citations

- [Workday](/systems/workday.md)
