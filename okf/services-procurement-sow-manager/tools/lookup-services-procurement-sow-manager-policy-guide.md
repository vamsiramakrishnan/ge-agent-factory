---
type: Agent Tool
title: lookup_services_procurement_sow_manager_policy_guide
description: "Look up sections of the Services Procurement & SOW Manager Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_services_procurement_sow_manager_policy_guide

Look up sections of the Services Procurement & SOW Manager Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP Fieldglass](/systems/sap-fieldglass.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP Fieldglass](/systems/sap-fieldglass.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Services Procurement & SOW Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/services-procurement-sow-manager-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_services_procurement_sow_manager_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP Fieldglass](/systems/sap-fieldglass.md)
