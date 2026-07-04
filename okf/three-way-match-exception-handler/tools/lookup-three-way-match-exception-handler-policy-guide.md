---
type: Agent Tool
title: lookup_three_way_match_exception_handler_policy_guide
description: "Look up sections of the Three-Way Match Exception Handler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_three_way_match_exception_handler_policy_guide

Look up sections of the Three-Way Match Exception Handler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_assembly](/workflow/data-assembly.md)
- [fuzzy_matching_auto_resolution](/workflow/fuzzy-matching-auto-resolution.md)
- [exception_reasoning](/workflow/exception-reasoning.md)
- [posting_escalation](/workflow/posting-escalation.md)

## Evals

- [Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/three-way-match-exception-handler-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_three_way_match_exception_handler_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP S/4HANA (MIRO/MIR7)](/systems/sap-s-4hana-miro-mir7.md)
