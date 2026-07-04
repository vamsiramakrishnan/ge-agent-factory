---
type: Agent Tool
title: lookup_aml_alert_investigation_agent_sar_ctr_filing_runbook
description: "Look up sections of the SAR/CTR Filing & Structuring Aggregation Runbook to cite in narrative output and escalation rationale."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# lookup_aml_alert_investigation_agent_sar_ctr_filing_runbook

Look up sections of the SAR/CTR Filing & Structuring Aggregation Runbook to cite in narrative output and escalation rationale.

- **Kind:** evidence_lookup
- **Source system:** [NICE Actimize](/systems/nice-actimize.md)

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

No explicit permission scopes declared; source-system access is tied to [NICE Actimize](/systems/nice-actimize.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_aml_alert_investigation_agent_sar_ctr_filing_runbook(section_anchor=<section_anchor>)
```

# Citations

- [NICE Actimize](/systems/nice-actimize.md)
