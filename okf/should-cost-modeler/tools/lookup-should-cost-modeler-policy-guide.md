---
type: Agent Tool
title: lookup_should_cost_modeler_policy_guide
description: "Look up sections of the Should-Cost Modeler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_should_cost_modeler_policy_guide

Look up sections of the Should-Cost Modeler Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [SAP S/4HANA (BOM/routing)](/systems/sap-s-4hana-bom-routing.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA (BOM/routing)](/systems/sap-s-4hana-bom-routing.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_data_assembly](/workflow/cost-data-assembly.md)
- [parametric_cost_regression](/workflow/parametric-cost-regression.md)
- [spec_interpretation_gap_narrative](/workflow/spec-interpretation-gap-narrative.md)

## Evals

- [Run the Should-Cost Modeler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/should-cost-modeler-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_should_cost_modeler_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [SAP S/4HANA (BOM/routing)](/systems/sap-s-4hana-bom-routing.md)
