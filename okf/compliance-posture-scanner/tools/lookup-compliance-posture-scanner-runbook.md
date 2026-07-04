---
type: Agent Tool
title: lookup_compliance_posture_scanner_runbook
description: "Look up sections of the Compliance Posture Scanner Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_compliance_posture_scanner_runbook

Look up sections of the Compliance Posture Scanner Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Qualys](/systems/qualys.md)

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

No explicit permission scopes declared; source-system access is tied to [Qualys](/systems/qualys.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_framework_scanning](/workflow/multi-framework-scanning.md)
- [control_effectiveness_scoring](/workflow/control-effectiveness-scoring.md)
- [compliance_narrative_generation](/workflow/compliance-narrative-generation.md)
- [evidence_collection_distribution](/workflow/evidence-collection-distribution.md)

## Evals

- [Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-posture-scanner-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_compliance_posture_scanner_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Qualys](/systems/qualys.md)
