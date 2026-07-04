---
type: Agent Tool
title: query_crowdstrike_scan_findings
description: "Retrieve scan findings from CrowdStrike for the Identity & Access Anomaly Detector workflow."
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

# query_crowdstrike_scan_findings

Retrieve scan findings from CrowdStrike for the Identity & Access Anomaly Detector workflow.

- **Kind:** query
- **Source system:** [CrowdStrike](/systems/crowdstrike.md)

## Inputs

- lookup_key
- date_range

## Outputs

- scan_findings_records
- scan_findings_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [CrowdStrike](/systems/crowdstrike.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/identity-access-anomaly-detector-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- scan_findings_records
- scan_findings_summary

# Examples

```
query_crowdstrike_scan_findings(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [CrowdStrike](/systems/crowdstrike.md)
