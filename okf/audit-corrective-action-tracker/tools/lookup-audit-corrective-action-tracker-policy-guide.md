---
type: Agent Tool
title: lookup_audit_corrective_action_tracker_policy_guide
description: "Look up sections of the Audit & Corrective Action Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_audit_corrective_action_tracker_policy_guide

Look up sections of the Audit & Corrective Action Tracker Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP GRC](/systems/sap-grc.md)
- **API:** POST /api/sap_grc/generate

## Inputs

- section_anchor

## Outputs

- document_section
- citation_anchor

## Side Effects

- May change SAP GRC state because the spec classifies it as evidence_lookup.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — lookup_audit_corrective_action_tracker_policy_guide](/policies/confirmation-lookup-audit-corrective-action-tracker-policy-guide.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP GRC](/systems/sap-grc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [audit_finding_intake](/workflow/audit-finding-intake.md)
- [recurrence_pattern_detection](/workflow/recurrence-pattern-detection.md)
- [capa_generation_response_assessment](/workflow/capa-generation-response-assessment.md)

## Evals

- [Run the Audit & Corrective Action Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-corrective-action-tracker-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_audit_corrective_action_tracker_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP GRC](/systems/sap-grc.md)
- [Confirmation policy — lookup_audit_corrective_action_tracker_policy_guide](/policies/confirmation-lookup-audit-corrective-action-tracker-policy-guide.md)
- [Idempotency policy — lookup_audit_corrective_action_tracker_policy_guide](/policies/idempotency-lookup-audit-corrective-action-tracker-policy-guide.md)
