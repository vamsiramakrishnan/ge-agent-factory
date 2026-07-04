---
type: Agent Tool
title: lookup_lead_nurture_optimizer_playbook
description: "Look up sections of the Lead Nurture Optimizer Playbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_lead_nurture_optimizer_playbook

Look up sections of the Lead Nurture Optimizer Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [HubSpot](/systems/hubspot.md)

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

No explicit permission scopes declared; source-system access is tied to [HubSpot](/systems/hubspot.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sequence_monitoring](/workflow/sequence-monitoring.md)
- [engagement_decay_modeling](/workflow/engagement-decay-modeling.md)
- [stall_diagnosis_content_adaptation](/workflow/stall-diagnosis-content-adaptation.md)
- [sequence_optimization](/workflow/sequence-optimization.md)

## Evals

- [Run the Lead Nurture Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-nurture-optimizer-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_lead_nurture_optimizer_playbook(section_anchor=<section_anchor>)
```

# Citations

- [HubSpot](/systems/hubspot.md)
