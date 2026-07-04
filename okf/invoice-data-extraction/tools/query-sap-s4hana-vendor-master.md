---
type: Agent Tool
title: query_sap_s4hana_vendor_master
description: Look up vendor master record by ID or alias name to validate vendor identity and resolve duplicates.
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

# query_sap_s4hana_vendor_master

Look up vendor master record by ID or alias name to validate vendor identity and resolve duplicates.

- **Kind:** query
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)

## Inputs

- vendor_name_or_id

## Outputs

- vendor_record
- alias_names
- sap_vendor_id
- vendor_status

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

- [llm_interpretation_entity_resolution](/workflow/llm-interpretation-entity-resolution.md)
- [validation_posting](/workflow/validation-posting.md)

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)
- [Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/tests/handwritten-llm-fallback.md)
- [Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.](/tests/vendor-alias-resolution.md)

## Evidence emitted

- source_system_record

## Required inputs

- vendor_name_or_id

## Produces

- vendor_record
- alias_names
- sap_vendor_id
- vendor_status

# Examples

```
query_sap_s4hana_vendor_master(vendor_name_or_id=<vendor_name_or_id>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
