---
type: Agent Tool
title: lookup_hris_data_quality_monitor_agent_policy_handbook
description: "Look up sections of the HRIS Data Quality Monitor Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence."
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

# lookup_hris_data_quality_monitor_agent_policy_handbook

Look up sections of the HRIS Data Quality Monitor Agent Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.

- **Kind:** evidence_lookup
- **Source system:** [Workday](/systems/workday.md)

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

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_scan](/workflow/data-scan.md)
- [anomaly_detection](/workflow/anomaly-detection.md)
- [quality_dashboard](/workflow/quality-dashboard.md)

## Evals

- [Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hris-data-quality-monitor-agent-end-to-end.md)

## Evidence emitted

- document_reference

## Required inputs

- section_anchor

## Produces

- document_section
- citation_anchor

# Examples

```
lookup_hris_data_quality_monitor_agent_policy_handbook(section_anchor=<section_anchor>)
```

# Citations

- [Workday](/systems/workday.md)
