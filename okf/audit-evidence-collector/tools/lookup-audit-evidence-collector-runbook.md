---
type: Agent Tool
title: lookup_audit_evidence_collector_runbook
description: "Look up sections of the Audit Evidence Collector Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_audit_evidence_collector_runbook

Look up sections of the Audit Evidence Collector Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Google Drive](/systems/google-drive.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Drive](/systems/google-drive.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [request_interpretation](/workflow/request-interpretation.md)
- [multi_system_collection](/workflow/multi-system-collection.md)
- [gap_analysis](/workflow/gap-analysis.md)
- [package_assembly](/workflow/package-assembly.md)

## Evals

- [Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-evidence-collector-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_audit_evidence_collector_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Google Drive](/systems/google-drive.md)
