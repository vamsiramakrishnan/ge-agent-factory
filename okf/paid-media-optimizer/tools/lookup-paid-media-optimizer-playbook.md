---
type: Agent Tool
title: lookup_paid_media_optimizer_playbook
description: "Look up sections of the Paid Media Optimizer Playbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_paid_media_optimizer_playbook

Look up sections of the Paid Media Optimizer Playbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google Ads](/systems/google-ads.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Ads](/systems/google-ads.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [performance_collection](/workflow/performance-collection.md)
- [root_cause_diagnosis](/workflow/root-cause-diagnosis.md)

## Evals

- [Run the Paid Media Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/paid-media-optimizer-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_paid_media_optimizer_playbook(section_anchor=<section_anchor>)
```

# Citations

- [Google Ads](/systems/google-ads.md)
