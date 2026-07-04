---
type: Agent Tool
title: lookup_insurance_liability_monitor_policy_guide
description: "Look up sections of the Insurance & Liability Monitor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_insurance_liability_monitor_policy_guide

Look up sections of the Insurance & Liability Monitor Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Insurance Cert Management](/systems/insurance-cert-management.md)

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

No explicit permission scopes declared; source-system access is tied to [Insurance Cert Management](/systems/insurance-cert-management.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [certificate_collection_tracking](/workflow/certificate-collection-tracking.md)
- [ocr_extraction_validation](/workflow/ocr-extraction-validation.md)

## Evals

- [Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/insurance-liability-monitor-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_insurance_liability_monitor_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Insurance Cert Management](/systems/insurance-cert-management.md)
