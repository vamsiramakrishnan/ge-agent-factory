---
type: Agent Tool
title: lookup_vendor_master_data_manager_controls_playbook
description: "Look up sections of the Vendor Master Data Manager Controls Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_vendor_master_data_manager_controls_playbook

Look up sections of the Vendor Master Data Manager Controls Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA](/systems/sap-s-4hana.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s-4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_collection_validation](/workflow/data-collection-validation.md)
- [duplicate_quality_detection](/workflow/duplicate-quality-detection.md)
- [identity_resolution](/workflow/identity-resolution.md)
- [master_update_audit](/workflow/master-update-audit.md)

## Evals

- [Run the Vendor Master Data Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-master-data-manager-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_vendor_master_data_manager_controls_playbook(section_anchor=<section_anchor>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s-4hana.md)
