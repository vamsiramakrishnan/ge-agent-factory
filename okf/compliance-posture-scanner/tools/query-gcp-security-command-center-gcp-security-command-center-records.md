---
type: Agent Tool
title: query_gcp_security_command_center_gcp_security_command_center_records
description: Retrieve gcp security command center records from GCP Security Command Center for the Compliance Posture Scanner workflow.
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

# query_gcp_security_command_center_gcp_security_command_center_records

Retrieve gcp security command center records from GCP Security Command Center for the Compliance Posture Scanner workflow.

- **Kind:** query
- **Source system:** [GCP Security Command Center](/systems/gcp-security-command-center.md)

## Inputs

- lookup_key
- date_range

## Outputs

- gcp_security_command_center_records_records
- gcp_security_command_center_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GCP Security Command Center](/systems/gcp-security-command-center.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-posture-scanner-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- gcp_security_command_center_records_records
- gcp_security_command_center_records_summary

# Examples

```
query_gcp_security_command_center_gcp_security_command_center_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GCP Security Command Center](/systems/gcp-security-command-center.md)
