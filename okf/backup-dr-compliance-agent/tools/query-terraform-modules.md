---
type: Agent Tool
title: query_terraform_modules
description: "Retrieve modules from Terraform for the Backup & DR Compliance Agent workflow."
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

# query_terraform_modules

Retrieve modules from Terraform for the Backup & DR Compliance Agent workflow.

- **Kind:** query
- **Source system:** [Terraform](/systems/terraform.md)

## Inputs

- lookup_key
- date_range

## Outputs

- modules_records
- modules_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Terraform](/systems/terraform.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Backup & DR Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/backup-dr-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- modules_records
- modules_summary

# Examples

```
query_terraform_modules(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Terraform](/systems/terraform.md)
