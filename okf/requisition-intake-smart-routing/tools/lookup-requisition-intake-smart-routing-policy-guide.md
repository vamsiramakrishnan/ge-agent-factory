---
type: Agent Tool
title: lookup_requisition_intake_smart_routing_policy_guide
description: "Look up sections of the Requisition Intake & Smart Routing Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_requisition_intake_smart_routing_policy_guide

Look up sections of the Requisition Intake & Smart Routing Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA MM (ME51N)](/systems/sap-s-4hana-mm-me51n.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM (ME51N)](/systems/sap-s-4hana-mm-me51n.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [requisition_ingestion](/workflow/requisition-ingestion.md)
- [classification_duplicate_detection](/workflow/classification-duplicate-detection.md)
- [intent_resolution_enrichment](/workflow/intent-resolution-enrichment.md)
- [smart_routing_notification](/workflow/smart-routing-notification.md)

## Evals

- [Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-smart-routing-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_requisition_intake_smart_routing_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP S/4HANA MM (ME51N)](/systems/sap-s-4hana-mm-me51n.md)
