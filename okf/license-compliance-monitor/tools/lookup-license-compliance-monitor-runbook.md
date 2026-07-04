---
type: Agent Tool
title: lookup_license_compliance_monitor_runbook
description: "Look up sections of the License Compliance Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_license_compliance_monitor_runbook

Look up sections of the License Compliance Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [BigQuery](/systems/bigquery.md)

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

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [entitlement_usage_merge](/workflow/entitlement-usage-merge.md)
- [compliance_gap_analysis](/workflow/compliance-gap-analysis.md)
- [optimization_reasoning](/workflow/optimization-reasoning.md)
- [reporting_tracking](/workflow/reporting-tracking.md)

## Evals

- [Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/license-compliance-monitor-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_license_compliance_monitor_runbook(section_anchor=<section_anchor>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
