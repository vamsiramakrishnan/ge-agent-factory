---
type: Agent Tool
title: evidence_vendor_validation_rules
description: "Cite vendor master validation rules for alias matching, duplicate detection, and resolution logic."
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

# evidence_vendor_validation_rules

Cite vendor master validation rules for alias matching, duplicate detection, and resolution logic.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)

## Inputs

- citation_anchor

## Outputs

- document_citation

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ocr_extraction_confidence_scoring](/workflow/ocr-extraction-confidence-scoring.md)
- [llm_interpretation_entity_resolution](/workflow/llm-interpretation-entity-resolution.md)
- [validation_posting](/workflow/validation-posting.md)

## Evals

- [Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.](/tests/vendor-alias-resolution.md)

## Evidence emitted

- document_reference

## Required inputs

- citation_anchor

## Produces

- document_citation

# Examples

```
evidence_vendor_validation_rules(citation_anchor=<citation_anchor>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
