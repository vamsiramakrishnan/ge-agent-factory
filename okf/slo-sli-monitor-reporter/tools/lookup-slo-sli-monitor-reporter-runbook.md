---
type: Agent Tool
title: lookup_slo_sli_monitor_reporter_runbook
description: "Look up sections of the SLO/SLI Monitor & Reporter Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_slo_sli_monitor_reporter_runbook

Look up sections of the SLO/SLI Monitor & Reporter Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Datadog](/systems/datadog.md)

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

No explicit permission scopes declared; source-system access is tied to [Datadog](/systems/datadog.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [sli_calculation](/workflow/sli-calculation.md)

## Evals

- [Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/slo-sli-monitor-reporter-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_slo_sli_monitor_reporter_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Datadog](/systems/datadog.md)
