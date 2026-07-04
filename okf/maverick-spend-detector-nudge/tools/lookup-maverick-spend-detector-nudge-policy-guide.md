---
type: Agent Tool
title: lookup_maverick_spend_detector_nudge_policy_guide
description: "Look up sections of the Maverick Spend Detector & Nudge Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_maverick_spend_detector_nudge_policy_guide

Look up sections of the Maverick Spend Detector & Nudge Procurement Policy Guide to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md)

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

No explicit permission scopes declared; source-system access is tied to [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [off_contract_detection](/workflow/off-contract-detection.md)
- [root_cause_classification](/workflow/root-cause-classification.md)
- [personalized_nudge_generation](/workflow/personalized-nudge-generation.md)
- [nudge_delivery_tracking](/workflow/nudge-delivery-tracking.md)

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_maverick_spend_detector_nudge_policy_guide(section_anchor=<section_anchor>)
```

# Citations

- [Coupa/Ariba Catalog](/systems/coupa-ariba-catalog.md)
