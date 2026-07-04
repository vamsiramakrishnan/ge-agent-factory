---
type: Agent Tool
title: lookup_siem_alert_triage_agent_runbook
description: "Look up sections of the SIEM Alert Triage Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_siem_alert_triage_agent_runbook

Look up sections of the SIEM Alert Triage Agent Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Splunk](/systems/splunk.md)

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

No explicit permission scopes declared; source-system access is tied to [Splunk](/systems/splunk.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [alert_ingestion_normalization](/workflow/alert-ingestion-normalization.md)
- [context_enrichment](/workflow/context-enrichment.md)
- [intelligent_classification](/workflow/intelligent-classification.md)
- [routing_feedback_loop](/workflow/routing-feedback-loop.md)

## Evals

- [Run the SIEM Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/siem-alert-triage-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_siem_alert_triage_agent_runbook(section_anchor=<section_anchor>)
```

# Citations

- [Splunk](/systems/splunk.md)
