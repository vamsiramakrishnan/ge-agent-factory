---
type: Agent Tool
title: lookup_offer_package_modeler_agent_policy_handbook
description: "Look up sections of the Offer Package Modeler Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_offer_package_modeler_agent_policy_handbook

Look up sections of the Offer Package Modeler Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google Sheets](/systems/google-sheets.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Sheets](/systems/google-sheets.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [scenario_modeling](/workflow/scenario-modeling.md)
- [approval_generation](/workflow/approval-generation.md)

## Evals

- [Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offer-package-modeler-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_offer_package_modeler_agent_policy_handbook(section_anchor=<section_anchor>)
```

# Citations

- [Google Sheets](/systems/google-sheets.md)
